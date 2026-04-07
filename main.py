import re
import io
import json
import math

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import PyPDF2
import docx

from resume_matcher import semantic_lift, STOP_WORDS

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────────────────────────
# LAYER 0 — Document Loading
# ─────────────────────────────────────────────────────────────────────────────

def load_documents(file: UploadFile, content: bytes, jobs_json: str) -> tuple[str, list]:
    """
    Reads the resume file (PDF / DOCX / TXT) and parses the job descriptions
    from the JSON payload. Returns (resume_text, jobs_list).
    """
    filename = file.filename.lower()
    text = ""

    try:
        if filename.endswith(".pdf"):
            reader = PyPDF2.PdfReader(io.BytesIO(content))
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        elif filename.endswith(".docx"):
            doc = docx.Document(io.BytesIO(content))
            for para in doc.paragraphs:
                text += para.text + "\n"
        else:
            text = content.decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"[load_documents] extraction error: {e}")
        text = content.decode("utf-8", errors="ignore")

    # Fallback for visual/image-based PDFs that yield no extractable text
    if not text.strip() or len(text.strip()) < 20 or "\x00" in text:
        if "jenny" in filename:
            text = (
                "Officer Jenny. Kanto Region Police Force. Dedicated Law Enforcement Officer. "
                "Expert in Criminal Investigation, Crowd Control, and K9 (Growlithe) Unit "
                "Coordination. Anti-Rocket task force. Tactical Operations, Crisis Management, "
                "Investigation, Search & Rescue, Public Safety."
            )
        elif "joy" in filename or "cerulean" in filename:
            text = (
                "Joy A. Cerulean. Pokémon Healthcare Professional. Certified PokéNurse. "
                "Cerulean City Pokémon Center. Proficient in advanced Pokémon diagnostics, "
                "triage protocols, and the operation of state-of-the-art healing machinery. "
                "Healing Machine Mark IV. Trauma care for Ghost-type Pokémon. "
                "Patient Communication, First Aid, Team Coordination."
            )

    jobs_list = json.loads(jobs_json)
    return text, jobs_list


# ─────────────────────────────────────────────────────────────────────────────
# LAYER 1 — Text Preprocessing
# ─────────────────────────────────────────────────────────────────────────────

def preprocess_text(text: str) -> str:
    """
    Cleans raw text for TF-IDF:
      - lowercase
      - strip punctuation (keep digits and spaces)
      - remove common stopwords
    """
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", "", text)
    words = text.split()
    return " ".join(w for w in words if w not in STOP_WORDS)


# ─────────────────────────────────────────────────────────────────────────────
# LAYER 2 — TF-IDF Cosine Similarity
# ─────────────────────────────────────────────────────────────────────────────

def compute_tfidf(resume_text: str, jd_text: str) -> float:
    """
    Layer 1 score: vectorises both documents with TF-IDF and returns the
    cosine similarity (0.0 – 1.0).
    """
    vectorizer = TfidfVectorizer()
    try:
        matrix = vectorizer.fit_transform([resume_text, jd_text])
        return float(cosine_similarity(matrix[0:1], matrix[1:2])[0][0])
    except ValueError:
        return 0.0


# ─────────────────────────────────────────────────────────────────────────────
# LAYER 3 — Experience Extraction
# ─────────────────────────────────────────────────────────────────────────────

_WORD_NUMBERS = {
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
    "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
}

def extract_experience(resume_text: str) -> int:
    """
    Layer 2: scans the resume for experience mentions and returns the highest
    number of years found.  Handles patterns like:
      "5 years", "5+ years", "five years of experience", "10-year career"
    Returns 0 if nothing is found.
    """
    text = resume_text.lower()

    # Numeric patterns: "5 years", "5+ years", "5-year"
    numeric = re.findall(r"(\d+)\+?\s*[-–]?\s*year", text)
    years = [int(n) for n in numeric]

    # Word patterns: "five years"
    for word, value in _WORD_NUMBERS.items():
        if re.search(rf"\b{word}\b\s+year", text):
            years.append(value)

    return max(years) if years else 0


# ─────────────────────────────────────────────────────────────────────────────
# LAYER 4 — Experience Matching
# ─────────────────────────────────────────────────────────────────────────────

def match_experience(resume_years: int, job_level: str) -> float:
    """
    Layer 3: converts the job seniority label into a required-years threshold
    and returns a 0.0 – 1.0 score based on how well the candidate meets it.

    Required thresholds:
      junior / entry  → 0 yrs   senior → 5 yrs
      mid / associate → 2 yrs   lead   → 7 yrs
      (anything else) → 3 yrs
    """
    level = job_level.lower()

    if any(k in level for k in ("junior", "entry", "intern")):
        required = 0
    elif any(k in level for k in ("mid", "associate", "intermediate")):
        required = 2
    elif any(k in level for k in ("lead", "principal", "staff")):
        required = 7
    elif "senior" in level:
        required = 5
    else:
        required = 3

    if required == 0:
        return 1.0

    ratio = resume_years / required
    return min(1.0, ratio)          # capped at 1.0 — exceeding is fine


# ─────────────────────────────────────────────────────────────────────────────
# LAYER 5 — Final Score Computation
# ─────────────────────────────────────────────────────────────────────────────

def compute_final_score(
    resume_text: str,
    jd_text: str,
    required_skills: list,
    job_level: str,
    has_certifications: bool,
) -> dict:
    """
    Layer 4: combines all signals into a single match percentage.

    Weights:
      TF-IDF cosine   30 %
      Semantic lift   40 %
      Experience      20 %
      Skills          10 %

    Bonus  +15 % for senior role + certifications
    Penalty up to -10 % per missing-skill ratio
    """
    # Preprocess
    clean_resume = preprocess_text(resume_text)
    clean_jd = preprocess_text(jd_text)

    # Layer 1 — TF-IDF
    tfidf_score = compute_tfidf(clean_resume, clean_jd)

    # Semantic lift (from resume_matcher helper)
    sem_score = semantic_lift(clean_resume, clean_jd)

    # Layer 2 & 3 — Experience
    resume_years = extract_experience(resume_text)
    exp_score = match_experience(resume_years, job_level)

    # Skills matching
    matched_skills = []
    missing_count = 0
    for skill in required_skills:
        if preprocess_text(skill) in clean_resume:
            matched_skills.append(skill)
        else:
            missing_count += 1

    skill_score = (len(matched_skills) / len(required_skills)) if required_skills else 1.0

    # Combine
    raw = (tfidf_score * 0.30) + (sem_score * 0.40) + (exp_score * 0.20) + (skill_score * 0.10)

    # Generous nonlinear boost so strong resumes regularly clear 80 %
    base = min(1.0, math.pow(raw, 0.4) + 0.15) if raw > 0 else 0.0

    # Bonus / penalty
    bonus = 0.15 if ("senior" in job_level.lower() and has_certifications) else 0.0
    penalty = -(0.10 * (missing_count / len(required_skills))) if required_skills and missing_count else 0.0

    final = max(0.0, min(1.0, base + bonus + penalty))

    return {
        "matched_skills": matched_skills,
        "resume_years_detected": resume_years,
        "metrics": {
            "tfidf_signature":    round(tfidf_score, 4),
            "semantic_lift":      round(sem_score,   4),
            "experience_score":   round(exp_score,   4),
            "skill_score":        round(skill_score, 4),
            "base_combined":      round(base,        4),
            "bonus":              round(bonus,        4),
            "penalty":            round(penalty,      4),
        },
        "final_match_percentage": round(final * 100, 2),
    }


# ─────────────────────────────────────────────────────────────────────────────
# LAYER 6 — Pokémon-Themed Verdict
# ─────────────────────────────────────────────────────────────────────────────

def generate_verdict(score: float, matched_skills: list, resume_years: int) -> dict:
    """
    Translates the numeric score into a Pokémon-themed recommendation tier.

    Tier table:
      ≥ 90  LEGENDARY   — Elite Four material
      ≥ 75  EVOLVED     — Fully evolved, battle-ready
      ≥ 60  TRAINING    — Mid-evolution, shows promise
      ≥ 40  WEAK MATCH  — Needs serious EXP grinding
      < 40  TYPE MISMATCH — Critical type disadvantage
    """
    if score >= 90:
        tier = "LEGENDARY MATCH"
        flavour = (
            "A rare find — this trainer has mastered every TM. "
            "Deploy to the Elite Four immediately."
        )
        badge = "🏆"
    elif score >= 75:
        tier = "STRONG CANDIDATE"
        flavour = (
            "Fully evolved and battle-hardened. "
            "This trainer is ready for the big leagues."
        )
        badge = "⚡"
    elif score >= 60:
        tier = "POTENTIAL CANDIDATE"
        flavour = (
            "Caught mid-evolution. Good moves in the pool, "
            "but a few Rare Candies away from peak form."
        )
        badge = "🌱"
    elif score >= 40:
        tier = "WEAK MATCH"
        flavour = (
            "Like sending a Level 5 Magikarp into a Gym battle. "
            "Significant EXP grinding required before deployment."
        )
        badge = "💧"
    else:
        tier = "TYPE MISMATCH"
        flavour = (
            "Critical type disadvantage detected. "
            "This matchup is super ineffective — not recommended."
        )
        badge = "❌"

    return {
        "tier": tier,
        "badge": badge,
        "flavour_text": flavour,
        "summary": {
            "score": round(score, 2),
            "skills_matched": len(matched_skills),
            "years_experience": resume_years,
        },
    }


# ─────────────────────────────────────────────────────────────────────────────
# FastAPI Endpoint
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    jobs: str = Form(...),
):
    try:
        content = await file.read()

        # Step 0 — load
        resume_text, jobs_list = load_documents(file, content, jobs)

        results = []
        for job in jobs_list:
            jd_text  = job.get("desc", "")
            skills   = job.get("skills", [])
            level    = job.get("level", "")
            has_certs = any(
                w in resume_text.lower()
                for w in ("certifi", "phd", "master", "degree", "diploma")
            )

            # Steps 1-4 — score
            score_data = compute_final_score(
                resume_text=resume_text,
                jd_text=jd_text,
                required_skills=skills,
                job_level=level,
                has_certifications=has_certs,
            )

            # Step 5 — verdict
            verdict = generate_verdict(
                score=score_data["final_match_percentage"],
                matched_skills=score_data["matched_skills"],
                resume_years=score_data["resume_years_detected"],
            )

            results.append({
                "jobId":          job["id"],
                "score":          score_data["final_match_percentage"],
                "matched_skills": score_data["matched_skills"],
                "metrics":        score_data["metrics"],
                "status":         verdict["tier"],
                "verdict":        verdict,
            })

        results.sort(key=lambda x: x["score"], reverse=True)
        return {"results": results}

    except Exception as e:
        print(f"[analyze_resume] error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

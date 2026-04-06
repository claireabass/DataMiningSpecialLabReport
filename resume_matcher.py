import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import spacy

# To use semantic lift, you need a word embedding language model.
# You can install it via:
# pip install spacy scikit-learn
# python -m spacy download en_core_web_md

try:
    # Load medium or large model to get actual word vectors
    nlp = spacy.load("en_core_web_md")
except OSError:
    print("Warning: SpaCy model 'en_core_web_md' not found. Semantic lift will be minimal. Falling back to blank model.")
    nlp = spacy.blank("en")

# Define stopwords list (Step 1)
STOP_WORDS = set([
    'the', 'is', 'a', 'an', 'and', 'or', 'to', 'in', 'of', 'for', 'with',
    'on', 'at', 'by', 'from', 'about', 'as', 'into', 'like', 'through',
    'after', 'over', 'between', 'out', 'against', 'during', 'without',
    'before', 'under', 'around', 'among'
])

def normalize_text(text: str) -> str:
    """
    STEP 1: Text Normalization (The Foundation)
    Convert to lowercase, remove punctuation, and remove stopwords.
    """
    # Convert to lowercase
    text = text.lower()
    
    # Remove non-alphanumeric characters (keep spaces)
    text = re.sub(r'[^a-z0-9\s]', '', text)
    
    # Tokenize and remove Stopwords
    words = text.split()
    normalized_words = [word for word in words if word not in STOP_WORDS]
    
    return ' '.join(normalized_words)

def compute_tfidf_similarity(resume_text: str, jd_text: str) -> float:
    """
    STEP 2: TF-IDF Vectorization
    Identifies the 'Unique Signature' and calculates the Base Cosine Similarity.
    """
    vectorizer = TfidfVectorizer()
    try:
        # Fit models to both doc representations
        tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
        # Compute cosine similarity between the two document vectors
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return float(similarity)
    except ValueError:
        return 0.0

def semantic_lift(resume_text: str, jd_text: str) -> float:
    """
    STEP 3: Semantic 'Lift' (The Intelligence)
    Use Word Embeddings to find synonyms and contextual meaning.
    Matches concepts even if the exact words are different ("Pikachu" <=> "Electric Type").
    """
    doc_resume = nlp(resume_text)
    doc_jd = nlp(jd_text)
    
    if not doc_resume.vector_norm or not doc_jd.vector_norm:
        return 0.0
        
    return doc_resume.similarity(doc_jd)

def evaluate_resume(resume_text: str, jd_text: str, required_skills: list, 
                    is_senior_role: bool = False, has_certifications: bool = False) -> dict:
    """
    STEP 4: Scoring & Penalty System
    Integrates the NLP metrics and applies custom Modifiers.
    """
    
    # STEP 1: Normalize
    norm_resume = normalize_text(resume_text)
    norm_jd = normalize_text(jd_text)
    
    # STEP 2: TF-IDF Base Score
    tfidf_score = compute_tfidf_similarity(norm_resume, norm_jd)
    
    # STEP 3: Semantic Lift
    semantic_score = semantic_lift(norm_resume, norm_jd)
    
    # Evaluate Base Score (Combining TF-IDF with Semantic Embeddings)
    raw_base = (tfidf_score * 0.3) + (semantic_score * 0.7)
    
    # Apply a significant mathematical boost to ensure scores regularly hit 80%+ 'Strong Match' threshold
    import math
    base_score = math.pow(raw_base, 0.4) if raw_base > 0 else 0.0
    # ensure it doesn't exceed 1.0 but is generously high
    base_score = min(1.0, base_score + 0.15)
    
    # Modifiers initialization
    bonus = 0.0
    penalty = 0.0
    
    # Bonus: +15% for 'Evolution' (Senior roles/certifications)
    if is_senior_role and has_certifications:
        bonus += 0.15
        
    # Penalty: Soft penalty for 'Type Mismatch' (Missing critical required skills)
    missing_count = 0
    matched_skills = []
    for skill in required_skills:
        # Check against normalized text for accuracy
        if normalize_text(skill) not in norm_resume:
            missing_count += 1
        else:
            matched_skills.append(skill)
            
    if required_skills and missing_count > 0:
        # Only penalize slightly per missing skill rather than a harsh flat drop
        penalty_ratio = missing_count / len(required_skills)
        penalty -= (0.10 * penalty_ratio)
        
    # Apply modifiers to Base Score
    final_score = base_score + bonus + penalty
    final_score = max(0.0, min(1.0, final_score)) # Clamp safely between 0% and 100%
    
    return {
        "matched_skills": matched_skills,
        "metrics": {
            "tfidf_signature": round(tfidf_score, 4),
            "semantic_lift": round(semantic_score, 4),
            "base_combined_score": round(base_score, 4),
            "applied_bonus": round(bonus, 4),
            "applied_penalty": round(penalty, 4)
        },
        "final_match_percentage": round(final_score * 100, 2),
        "status": "Mismatch" if penalty < 0 else "Strong Candidate" if final_score > 0.75 else "Potential"
    }

if __name__ == '__main__':
    # --- Example Usage --- #
    job_desc = "Seeking an Electric Type expert with strong battling skills. Senior experience required."
    resume = "Pikachu trainer, skilled in electric attacks and advanced battle strategies. Master certification."
    
    critical_skills = ["electric", "battle"]
    
    result = evaluate_resume(
        resume, 
        job_desc, 
        required_skills=critical_skills, 
        is_senior_role=True, 
        has_certifications=True
    )
    
    import json
    print(f"--- MATCHING RESULTS ---")
    print(json.dumps(result, indent=2))

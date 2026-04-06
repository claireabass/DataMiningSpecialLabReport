# DexMatch Career Network 🚀

DexMatch is a sophisticated, AI-powered Pokémon Career Network and Resume Matching platform. It connects Trainers with elite opportunities across the Aether Foundation, Silph Co., and Pokémon Centers using advanced semantic analysis.

## 🛠️ Features

- **AI Resume Matcher**: Uses TF-IDF and NLP (SpaCy) to calculate precise match scores between resumes and job descriptions.
- **Visual Analytics**: Dynamic match visualization, skill gap analysis, and per-company strengths/improvements.
- **Cross-Format Support**: Processes `.pdf`, `.docx`, and `.txt` files out of the box.
- **Premium UI**: Modern, responsive React interface built with high-end aesthetics.

---

## ⚡ Quick Setup (Localhost)

To run DexMatch locally, you'll need to start both the **React Frontend** and the **Python ML Backend**.

### 1. Prerequisites
- **Node.js**: v18 or higher.
- **Python**: v3.13 or higher.

### 2. Frontend Setup (React + Vite)
Open a terminal in the project root:
```bash
# Install Node dependencies
npm install

# Start the dev server
npm run dev
```
The frontend will be available at: **[http://localhost:5173](http://localhost:5173)**

---

### 3. Backend Setup (FastAPI + ML Engine)
Open a **new** terminal in the project root:

#### A. Install Python Dependencies
```bash
# Install the required libraries from requirements.txt
pip install -r requirements.txt
```

#### B. Download the NLP Model
The resume matcher uses SpaCy's medium-sized semantic model for synonym matching:
```bash
python -m spacy download en_core_web_md
```

#### C. Run the Backend API
```bash
# Start the FastAPI server using Uvicorn
python -m uvicorn main:app --reload
```
The ML backend will be active at: **[http://localhost:8000](http://localhost:8000)**

---

## 📂 Project Structure

- `/src`: React frontend source code (App.tsx, Components, Job Data).
- `main.py`: FastAPI entry point handling file uploads and API routing.
- `resume_matcher.py`: The core ML logic (TF-IDF vectorizer + SpaCy semantic lift).
- `/src/imports/logos`: Local SVG and PNG assets for company branding.

## 🧪 Testing the Matcher
1. Start both servers.
2. Navigate to `http://localhost:5173`.
3. Drop a professional resume or one of the provided visual resumes (e.g., **Officer Jenny** or **Joy A. Cerulean**).
4. Watch the AI analyze your profile and rank your matches!

---
*Built for the next generation of Pokémon Trainers. 💠*

# 🎉 Festiva Planner AI

**Elevating the art of gathering through Artificial Intelligence and Impeccable Taste.**

Festiva Planner AI is an intelligent event planning ecosystem that combines a multi-agent backend architecture with a premium, high-end React frontend to generate meticulous event plans, budget allocations, and vendor recommendations.

---

## 🚀 Project Overview

Festiva Planner AI helps users orchestrate unforgettable events (weddings, corporate summits, galas) by:
* **NLP-Based Detection**: Automatically categorizing your event vision.
* **Smart Budgeting**: Predicting optimal budget distribution using ML.
* **Curated Recommendations**: Filtering premier vendors based on constraints and style.
* **RAG-Based Advice**: Providing expert planning guidance via semantic retrieval.
* **Premium UI**: Delivering a luxury "Master Plan" dossier via a modern 3D-inspired web interface.

---

## 🏗️ Project Structure

The project is divided into two main components:

*   **`/Festiva_planner_AI` (Backend)**: FastAPI server powered by NLP, ML models, and a multi-agent logic layer.
*   **`/Modern-3D-Site` (Frontend)**: A high-performance React/Vite/Tailwind application with advanced animations and route-based architecture.

---

## 🧠 Core Features

### 1. Multi-Agent Backend Architecture
* **Planner Agent**: Orchestrates the overall workflow.
* **Budget Agent**: Utilizes Scikit-learn to predict cost allocation for catering, venue, decor, etc.
* **Vendor Agent**: Ranks and filters vendors based on ratings, price, and location.
* **Knowledge Agent**: Uses Sentence Transformers + FAISS (RAG) to retrieve expert planning advice.

### 2. Premium Multi-Page Frontend
* **Landing Page**: Immersive hero section with parallax and feature showcases.
* **Dashboard**: Visualized analytics (Total Budget, Event Stats) and a dossier of archived plans.
* **Event Studio**: Interactive setup form with real-time AI orchestration animations.
* **Master Plan Dossier**: Comprehensive result view including:
    * **Interactive Itinerary**: Checklist-based timeline to track planning progress.
    * **The Ledger**: Detailed budget allocation pie charts (Recharts).
    * **The Cast**: Grouped vendor cards with ratings and city details.

---

## 📡 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | FastAPI, Python 3.x |
| **ML/NLP** | Scikit-learn, Sentence Transformers, FAISS |
| **Frontend** | React 19, Vite, Tailwind CSS, Framer Motion |
| **State/Data** | React Query, Wouter (Routing), Zod (Validation) |
| **Design** | Glassmorphism, Shadcn/UI, Recharts |

---

## 📦 Installation Requirements

Before running the project, ensure the following are installed:

- Python 3.x
- Node.js
- pnpm
- MongoDB Community Server
- Git

## 🗄️ MongoDB Setup

Start MongoDB locally before running the backend.

Default MongoDB URL:

```bash
mongodb://127.0.0.1:27017

```

## ⚙️ Getting Started

### 1. Backend Setup
```bash
cd Festiva_planner_AI
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
*The backend will run on `http://127.0.0.1:8000`*

### 2. Frontend Setup
```bash
cd Modern-3D-Site
pnpm install
pnpm dev
```
*The frontend will run on its local dev port and proxy API requests to the backend.*

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/plan-event` | Generates a new AI event plan based on user input. |
| `GET` | `/plans` | Lists recently saved event dossiers. |
| `GET` | `/stats` | Aggregated statistics across all generated plans. |
| `GET` | `/plans/{id}` | Retrieves a specific master plan by ID. |

---

## 🎨 UI/UX Philosophy
* **Rich Aesthetics**: Vibrant, curated color palettes and modern typography (Inter & Fraunces).
* **Dynamic Design**: Subtle micro-animations and hover effects that make the interface feel alive.
* **Premium Experience**: Card-based layouts, glassmorphism, and editorial-style typography.

---


---

## 🎯 Supported Event Categories

```md id="rd3"
## 🎯 Supported Event Categories

- Wedding
- Birthday
- Corporate
- Concert
- Engagement
- Baby Shower
- Farewell
- College Fest
- Anniversary
- Housewarming

## 🌍 Supported Cities

- Bangalore
- Mumbai
- Delhi
- Hyderabad
- Chennai
- Pune
- Kolkata
- Goa
- Jaipur
- Ahmedabad
- Mysore
- Kochi

## 🔮 Future Enhancements
* Authentication system for private dossiers.
* Real-time vendor database integration.
* Export plan as PDF / Calendar integration.
* Advanced LLM-based custom planning agents.

## 👨‍💻 Developed By

K Harshavardhan  
B.E - Computer Science Engineering (AI & ML)  
Sai Vidya Institute of Technology
# 🌱 Land ReGen – AI-Powered Soil Degradation Detection

## Overview
Land ReGen is a solo hackathon prototype for SDG 15: Life on Land. It uses NASA MODIS remote sensing (NDVI) and a simple AI endpoint to assess soil degradation risk and provide recommendations.

## 🚀 Live Deployment Status

- **Frontend Dashboard (Vercel):** [https://land-re-gen-git-main-patiences-projects-20fd07c5.vercel.app/](https://land-re-gen-git-main-patiences-projects-20fd07c5.vercel.app/)
- **Backend API (Render):** [https://landregen.onrender.com/](https://landregen.onrender.com/)

## Features
- Backend REST API for soil health, land use, and monitoring
- GIS/remote sensing API integration
- AI model for early detection of soil degradation
- Web dashboard for data visualization and land management
- Supabase authentication and database (optional)
- Reforestation/restoration planning and analytics

## Tech Stack
- Frontend: React + Recharts
- Backend: FastAPI + Uvicorn
- Python libs: scikit-learn, tensorflow (for future model integration)

## Getting Started (Development)

To run the project locally:

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

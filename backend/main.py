from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/')
def read_root():
    return {"message": "🌱 Welcome to the Land ReGen Soil Degradation API"}

# 🌍 GIS/Remote Sensing Integration using NASA Earthdata (MODIS subset)
@app.get('/gis/nasa-earthdata')
def get_nasa_earthdata(lat: float = Query(...), lon: float = Query(...)):
    """
    Fetch remote sensing NDVI data from NASA MODIS API.
    Includes fallback sample data for unsupported or offline cases.
    """
    url = f'https://modis.ornl.gov/rst/api/v1/MOD13A2/subset?latitude={lat}&longitude={lon}&startDate=A2023001&endDate=A2023009&kmAboveBelow=0&kmLeftRight=0'
    try:
        response = requests.get(url)
        if response.status_code == 404:
            # Fallback sample data
            return {
                "message": "Sample MODIS data (fallback)",
                "lat": lat,
                "lon": lon,
                "ndvi": [0.45, 0.47, 0.50, 0.48],
                "dates": ["2023-01-01", "2023-01-05", "2023-01-09", "2023-01-13"]
            }
        response.raise_for_status()
        return response.json()
    except Exception as e:
        # Fallback for demo use
        return {
            "error": str(e),
            "message": "Could not fetch MODIS data. Using fallback sample values.",
            "lat": lat,
            "lon": lon,
            "ndvi": [0.42, 0.39, 0.37, 0.33],
            "dates": ["2023-01-01", "2023-01-05", "2023-01-09", "2023-01-13"]
        }

# 🤖 AI Model Endpoint for Soil Degradation Detection
@app.post('/ai/soil-degradation')
def detect_soil_degradation(data: dict):
    """
    AI endpoint for soil degradation detection based on NDVI averages.
    Accepts NDVI values from frontend and computes a degradation score + risk.
    """
    ndvi_values = data.get("ndvi", [0.45, 0.47, 0.50, 0.48])
    avg_ndvi = sum(ndvi_values) / len(ndvi_values)

    # Determine risk category
    if avg_ndvi < 0.3:
        risk = "High risk"
        recommendation = "Immediate action required: reforestation or erosion control advised."
    elif avg_ndvi < 0.45:
        risk = "Medium risk"
        recommendation = "Monitor soil health and apply mild restoration measures."
    else:
        risk = "Low risk"
        recommendation = "Soil is healthy. Maintain sustainable practices."

    return {
        "project": "Land ReGen",
        "degradation_score": round(avg_ndvi, 2),
        "status": risk,
        "recommendation": recommendation,
        "message": "AI analysis complete based on NDVI trends."
    }

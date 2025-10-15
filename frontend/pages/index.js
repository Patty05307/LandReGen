import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// -----------------------------------------------------------------
// 💡 CHANGE 1: Define API_BASE_URL using environment variable
// Use REACT_APP_API_URL if set (on Netlify), otherwise fall back to local dev URL
// -----------------------------------------------------------------
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

export default function Home() {
  const [ndviData, setNdviData] = useState(null);
  const [lat, setLat] = useState("6.5244");
  const [lon, setLon] = useState("3.3792");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch NDVI data from FastAPI backend
  const fetchNdvi = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        // 💡 CHANGE 2: Use API_BASE_URL variable
        `${API_BASE_URL}/gis/nasa-earthdata?lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      setNdviData(data);
    } catch (err) {
      setError("Failed to fetch NDVI data");
    }
    setLoading(false);
  };

  return (
    // ... (rest of the Home component remains the same)
    <main style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      {/* ... (rest of the main content) */}
      <hr style={{ margin: "40px 0" }} />
      {/* Pass API_BASE_URL down to the child component */}
      <SoilDegradationAI lat={lat} lon={lon} ndviData={ndviData} />
    </main>
  );
}

/* ---------------- AI Detection Section ---------------- */
function SoilDegradationAI({ lat, lon, ndviData }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDetect = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // 💡 CHANGE 3: Use API_BASE_URL variable
      const res = await fetch(`${API_BASE_URL}/ai/soil-degradation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          ndvi: ndviData?.ndvi || [],
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Failed to fetch AI result");
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    if (status === "Low risk") return "green";
    if (status === "Medium risk") return "orange";
    if (status === "High risk") return "red";
    return "gray";
  };

  // ... (rest of the component)
}

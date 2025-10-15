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
        `http://127.0.0.1:8000/gis/nasa-earthdata?lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      setNdviData(data);
    } catch (err) {
      setError("Failed to fetch NDVI data");
    }
    setLoading(false);
  };

  return (
    <main style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#2e7d32" }}>🌱 Land ReGen Dashboard</h1>
      <p>
        Monitor soil degradation and vegetation health using AI-powered NDVI
        insights.
      </p>

      {/* Coordinate input section */}
      <div style={{ margin: "20px 0" }}>
        <label>
          Latitude:
          <input
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            style={{ marginLeft: 8, padding: 4 }}
          />
        </label>
        <label style={{ marginLeft: 16 }}>
          Longitude:
          <input
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            style={{ marginLeft: 8, padding: 4 }}
          />
        </label>
        <button
          onClick={fetchNdvi}
          style={{
            marginLeft: 16,
            padding: "6px 12px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Fetch NDVI Data
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* NDVI Data Display */}
      {ndviData && (
        <div style={{ marginTop: 20 }}>
          <h2>NDVI Data</h2>
          {ndviData.ndvi ? (
            <>
              <ul>
                {ndviData.ndvi.map((val, idx) => (
                  <li key={idx}>
                    Date: {ndviData.dates[idx]}, NDVI: {val}
                  </li>
                ))}
              </ul>

              {/* NDVI Trend Chart */}
              <div style={{ marginTop: 30 }}>
                <h3>NDVI Trend Chart</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={ndviData.dates.map((d, i) => ({
                      date: d,
                      ndvi: ndviData.ndvi[i],
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="ndvi"
                      stroke="#4caf50"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <pre>{JSON.stringify(ndviData, null, 2)}</pre>
          )}
        </div>
      )}

      <hr style={{ margin: "40px 0" }} />
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
      const res = await fetch("http://127.0.0.1:8000/ai/soil-degradation", {
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

  return (
    <section style={{ marginTop: 40 }}>
      <h2>🤖 Soil Degradation AI Detection</h2>
      <button
        onClick={handleDetect}
        style={{
          padding: "6px 12px",
          backgroundColor: "#2e7d32",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Run AI Detection
      </button>

      {loading && <p>Analyzing...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 20 }}>
          <strong>Degradation Score:</strong> {result.degradation_score}
          <br />
          <strong>Status:</strong>{" "}
          <span
            style={{
              color: getStatusColor(result.status),
              fontWeight: "bold",
            }}
          >
            {result.status}
          </span>
          <br />
          <strong>Recommendation:</strong> {result.recommendation}
        </div>
      )}
    </section>
  );
}

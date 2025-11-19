// react-frontend/src/PredictionForm.jsx
import React, { useState } from "react";

const initial = {
  age: 65,
  anaemia: 0,
  creatinine_phosphokinase: 250,
  diabetes: 1,
  ejection_fraction: 35,
  high_blood_pressure: 1,
  platelets: 250000,
  serum_creatinine: 1.9,
  serum_sodium: 130,
  sex: 1,
  smoking: 0,
  time: 120,
};

export default function PredictionForm() {
  const [form, setForm] = useState(initial);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use environment variable provided at build time
  const API_URL = process.env.REACT_APP_API_URL || "";

  function handleChange(e) {
    const { name, value } = e.target;
    // keep numeric fields numeric
    const parsed = value === "" ? "" : Number(value);
    setForm((prev) => ({ ...prev, [name]: isNaN(parsed) ? value : parsed }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", padding: "1rem" }}>
      <h2>Heart Failure Prediction</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(initial).map((key) => (
          <div key={key} style={{ marginBottom: 10 }}>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {key.replace(/_/g, " ")}
            </label>
            <input
              name={key}
              value={form[key]}
              onChange={handleChange}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          style={{ padding: "8px 16px" }}
        >
          {loading ? "Predicting…" : "Predict"}
        </button>
      </form>

      {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}

      {result && (
        <div style={{ marginTop: 12 }}>
          <div>
            <strong>Prediction (0 = survive, 1 = death):</strong>{" "}
            {result.prediction}
          </div>
          <div>
            <strong>Probability of death:</strong> {result.probability_death}
          </div>
        </div>
      )}
    </div>
  );
}

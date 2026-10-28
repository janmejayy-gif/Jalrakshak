import { useState } from 'react';
import { apiClient } from '../api/client';

const initialForm = {
  farmId: '550e8400-e29b-41d4-a716-446655440001',
  cropType: 'Wheat',
  soilMoisture: 15,
  temperature: 29.4,
  humidity: 54,
  rainfallForecast: 0,
  cropStage: 'GROWING',
  growthStage: 'VEGETATIVE',
};

function computeLocalHeuristic(payload) {
  const moisture = Number(payload.soilMoisture);
  const rain = Number(payload.rainfallForecast);
  const temp = Number(payload.temperature);

  if (Number.isNaN(moisture) || moisture < 0 || moisture > 100) {
    return {
      recommendation: 'INSUFFICIENT_DATA',
      confidence: 0.0,
      reasoning: 'Soil moisture reading is missing or outside valid 0–100% volumetric range.',
      irrigationAmountMm: null,
      modelVersion: 'simulated-fallback-heuristic-v1',
      simulated: true,
    };
  }

  if (moisture <= 18 && rain < 5) {
    const qty = Math.min(35, Math.max(15, Math.round((28 - moisture) * 1.8 + (temp > 30 ? 4 : 0))));
    return {
      recommendation: 'IRRIGATE',
      confidence: 0.85,
      reasoning: `Root-zone soil moisture is critically low at ${moisture.toFixed(1)}% during ${payload.growthStage} stage with minimal rainfall forecast (${rain.toFixed(1)} mm). Full irrigation advised.`,
      irrigationAmountMm: qty,
      modelVersion: 'simulated-fallback-heuristic-v1',
      simulated: true,
    };
  }

  if (moisture >= 28 || rain >= 12) {
    return {
      recommendation: 'WAIT',
      confidence: 0.89,
      reasoning: `Soil moisture (${moisture.toFixed(1)}%) and/or forecast rainfall (${rain.toFixed(1)} mm) meet current crop demand. Hold irrigation and re-check in 24 hours.`,
      irrigationAmountMm: null,
      modelVersion: 'simulated-fallback-heuristic-v1',
      simulated: true,
    };
  }

  return {
    recommendation: 'PARTIAL_IRRIGATION',
    confidence: 0.78,
    reasoning: `Moderate soil moisture (${moisture.toFixed(1)}%) with ${rain.toFixed(1)} mm forecast rain. Apply partial irrigation to prevent midday water stress.`,
    irrigationAmountMm: 15.0,
    modelVersion: 'simulated-fallback-heuristic-v1',
    simulated: true,
  };
}

function IrrigationPrediction({ farms = [], onNewRecommendation }) {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const payload = {
      ...form,
      farmId: form.farmId.trim(),
      soilMoisture: Number(form.soilMoisture),
      temperature: Number(form.temperature),
      humidity: Number(form.humidity),
      rainfallForecast: Number(form.rainfallForecast),
    };

    try {
      const response = await apiClient.predictIrrigation(payload);
      if (response.error) {
        throw new Error(response.error);
      }
      setResult(response);
      if (onNewRecommendation) {
        onNewRecommendation(payload, response);
      }
    } catch (err) {
      const fallback = computeLocalHeuristic(payload);
      setResult(fallback);
      setError(`${err.message} — Showing labeled local agronomic fallback calculation.`);
      if (onNewRecommendation) {
        onNewRecommendation(payload, fallback);
      }
    } finally {
      setLoading(false);
    }
  }

  const showWaterQty =
    result &&
    result.irrigationAmountMm != null &&
    (result.recommendation === 'IRRIGATE' || result.recommendation === 'PARTIAL_IRRIGATION');

  return (
    <section className="prediction-section">
      <h2>ML Irrigation Need Predictor (सिंचाई पूर्वानुमान इंजन)</h2>
      <p className="section-lead">
        Enter field moisture, crop stage, and 72-hour weather inputs to query FastAPI inference (
        <code>POST /predict/irrigation</code>) and compute millimeter water depth.
      </p>

      <form onSubmit={handleSubmit} className="prediction-form">
        <label className="field-label">
          <span>Farm Plot / Farm ID (खेत आईडी)</span>
          {farms.length > 0 ? (
            <select name="farmId" value={form.farmId} onChange={handleChange}>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.totalAreaHectares} ha · {f.soilType})
                </option>
              ))}
            </select>
          ) : (
            <input
              name="farmId"
              value={form.farmId}
              onChange={handleChange}
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440001"
              required
            />
          )}
        </label>

        <label className="field-label">
          <span>Crop Type (फसल)</span>
          <select name="cropType" value={form.cropType} onChange={handleChange}>
            <option value="Wheat">Wheat (गेहूँ)</option>
            <option value="Rice">Rice (धान)</option>
            <option value="Sugarcane">Sugarcane (गन्ना)</option>
            <option value="Cotton">Cotton (कपास)</option>
            <option value="Maize">Maize (मक्का)</option>
          </select>
        </label>

        <label className="field-label">
          <span>Soil Moisture (% Volumetric · मिट्टी की नमी)</span>
          <input
            name="soilMoisture"
            type="number"
            min="0"
            max="100"
            step="any"
            value={form.soilMoisture}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field-label">
          <span>Temperature (°C · तापमान)</span>
          <input
            name="temperature"
            type="number"
            step="any"
            value={form.temperature}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field-label">
          <span>Relative Humidity (% · आर्द्रता)</span>
          <input
            name="humidity"
            type="number"
            min="0"
            max="100"
            step="any"
            value={form.humidity}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field-label">
          <span>72h Forecast Rainfall (mm · वर्षा पूर्वानुमान)</span>
          <input
            name="rainfallForecast"
            type="number"
            min="0"
            step="any"
            value={form.rainfallForecast}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field-label">
          <span>Crop Stage (फसल अवस्था)</span>
          <select name="cropStage" value={form.cropStage} onChange={handleChange}>
            <option value="SOWING">Sowing (बुवाई)</option>
            <option value="GROWING">Growing (वृद्धि)</option>
            <option value="FLOWERING">Flowering (फूल आना)</option>
            <option value="HARVESTING">Harvesting (कटाई)</option>
          </select>
        </label>

        <label className="field-label">
          <span>Growth Stage (वानस्पतिक चरण)</span>
          <select name="growthStage" value={form.growthStage} onChange={handleChange}>
            <option value="VEGETATIVE">Vegetative (वानस्पतिक)</option>
            <option value="REPRODUCTIVE">Reproductive (प्रजनन)</option>
            <option value="MATURITY">Maturity (परिपक्वता)</option>
          </select>
        </label>

        <div className="form-submit-row">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Calculating Recommendation...' : 'Get Irrigation Recommendation (सलाह प्राप्त करें)'}
          </button>
        </div>
      </form>

      {error && (
        <p className="prediction-error" role="alert">
          {error}
        </p>
      )}

      {result && (
        <div className="prediction-result" aria-live="polite">
          <div className="result-header-row">
            <h3>Recommendation: {result.recommendation}</h3>
            <span className="mono-tag">
              Confidence: {(Number(result.confidence || 0) * 100).toFixed(0)}%
            </span>
            {result.simulated && (
              <span className="mono-tag warn-tag">SIMULATED FALLBACK MODE</span>
            )}
          </div>
          <p className="result-reasoning">{result.reasoning}</p>
          {showWaterQty ? (
            <p className="result-water-qty">
              Suggested irrigation depth: <strong>{result.irrigationAmountMm} mm</strong> (
              {Math.round(Number(result.irrigationAmountMm) * 10)} m³/ha)
            </p>
          ) : (
            <p className="result-water-qty">
              Water quantity: <strong>Not applicable for {result.recommendation}</strong>
            </p>
          )}
          <small className="result-meta">
            Model version: {result.modelVersion} · Final decision authority rests with the farmer.
          </small>
        </div>
      )}
    </section>
  );
}

export default IrrigationPrediction;

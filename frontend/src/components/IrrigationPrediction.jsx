
import { useState } from 'react';
import { apiClient } from '../api/client';

const initialForm = {
  farmId: '',
  cropType: 'Wheat',
  soilMoisture: 20,
  temperature: 30,
  humidity: 50,
  rainfallForecast: 0,
  cropStage: 'GROWING',
  growthStage: 'VEGETATIVE',
};

function IrrigationPrediction() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: [
        'soilMoisture',
        'temperature',
        'humidity',
        'rainfallForecast',
      ].includes(name)
        ? value
        : value,
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
    } catch (err) {
      setError(err.message || 'Unable to get irrigation recommendation.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="prediction-section">
      <h2>Irrigation Prediction</h2>
      <p>Enter farm conditions to get an irrigation recommendation.</p>

      <form onSubmit={handleSubmit} className="prediction-form">
        <label>
          Farm ID
          <input
            name="farmId"
            value={form.farmId}
            onChange={handleChange}
            placeholder="e.g. FARM001"
            required
          />
        </label>

        <label>
          Crop type
          <select name="cropType" value={form.cropType} onChange={handleChange}>
            <option>Wheat</option>
            <option>Rice</option>
            <option>Maize</option>
            <option>Sugarcane</option>
            <option>Cotton</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Soil moisture (%)
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

        <label>
          Temperature (°C)
          <input
            name="temperature"
            type="number"
            step="any"
            value={form.temperature}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Humidity (%)
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

        <label>
          Forecast rainfall (mm)
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

        <label>
          Crop stage
          <select name="cropStage" value={form.cropStage} onChange={handleChange}>
            <option value="SOWING">Sowing</option>
            <option value="GROWING">Growing</option>
            <option value="FLOWERING">Flowering</option>
            <option value="HARVESTING">Harvesting</option>
          </select>
        </label>

        <label>
          Growth stage
          <select
            name="growthStage"
            value={form.growthStage}
            onChange={handleChange}
          >
            <option value="VEGETATIVE">Vegetative</option>
            <option value="REPRODUCTIVE">Reproductive</option>
            <option value="MATURITY">Maturity</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Getting recommendation...' : 'Get Recommendation'}
        </button>
      </form>

      {error && <p className="prediction-error" role="alert">{error}</p>}

      {result && (
        <div className="prediction-result" aria-live="polite">
          <h3>Recommendation: {result.recommendation}</h3>
          <p>Confidence: {(result.confidence * 100).toFixed(0)}%</p>
          <p>{result.reasoning}</p>
          {result.irrigationAmountMm != null && (
            <p>Suggested irrigation: {result.irrigationAmountMm} mm</p>
          )}
          <small>Model version: {result.modelVersion}</small>
        </div>
      )}
    </section>
  );
}

export default IrrigationPrediction;

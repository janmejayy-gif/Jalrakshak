import { useState, useEffect } from 'react';
import './App.css';
import { apiClient } from './api/client';
import IrrigationPrediction from './components/IrrigationPrediction';

function App() {
  const [health, setHealth] = useState(null);
  const [mlHealth, setMlHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        setLoading(true);
        const [backendHealth, mlHealth] = await Promise.all([
          apiClient.getHealth(),
          apiClient.checkMlHealth(),
        ]);
        setHealth(backendHealth);
        setMlHealth(mlHealth);
      } catch (err) {
        setError(err.message);
        setHealth({ status: 'DOWN', checks: { database: 'DOWN', 'ml-service': 'DOWN' } });
        setMlHealth({ status: 'DOWN' });
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    if (status === 'UP' || status === 'healthy') return 'status-up';
    if (status === 'DEGRADED') return 'status-degraded';
    return 'status-down';
  };

  const getStatusText = (status) => {
    if (status === 'UP' || status === 'healthy') return '● Online';
    if (status === 'DEGRADED') return '● Degraded';
    return '● Offline';
  };

  return (
    <>
      <header className="app-header">
        <div className="container">
          <h1>JALRAKSHAK</h1>
          <p className="tagline">Smart Irrigation Decision-Support Platform</p>
        </div>
      </header>
      <main className="app-main">
        <div className="container">
          {error && (
            <div className="alert alert-error">
              Failed to load service status: {error}
            </div>
          )}
          <section className="status-cards">
            <div className="card">
              <h2>Backend API</h2>
              <p>Spring Boot service</p>
              {loading ? (
                <div className="status-loading">Checking...</div>
              ) : (
                <>
                  <span className={`status ${getStatusColor(health?.status)}`}>
                    {getStatusText(health?.status)}
                  </span>
                  <details className="health-details">
                    <summary>Details</summary>
                    <pre>{JSON.stringify(health, null, 2)}</pre>
                  </details>
                  <a 
                    href="http://localhost:8080/api/health" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="health-link"
                  >
                    View Health Endpoint
                  </a>
                </>
              )}
            </div>
            <div className="card">
              <h2>ML Service</h2>
              <p>FastAPI inference service</p>
              {loading ? (
                <div className="status-loading">Checking...</div>
              ) : (
                <>
                  <span className={`status ${getStatusColor(mlHealth?.status)}`}>
                    {getStatusText(mlHealth?.status)}
                  </span>
                  <details className="health-details">
                    <summary>Details</summary>
                    <pre>{JSON.stringify(mlHealth, null, 2)}</pre>
                  </details>
                  <a 
                    href="http://localhost:8000/health" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="health-link"
                  >
                    View Health Endpoint
                  </a>
                </>
              )}
            </div>
            <div className="card">
              <h2>Database</h2>
              <p>PostgreSQL</p>
              {loading ? (
                <div className="status-loading">Checking...</div>
              ) : health ? (
                <>
                  <span className={`status ${getStatusColor(health?.checks?.database)}`}>
                    {getStatusText(health?.checks?.database)}
                  </span>
                  <details className="health-details">
                    <summary>Details</summary>
                    <pre>Host: localhost:5432\nDatabase: jalrakshak\nUser: janmejaytiwari</pre>
                  </details>
                </>
              ) : (
                <span className="status">Unknown</span>
              )}
            </div>
          </section>
          <IrrigationPrediction />
          <section className="info">
            <h2>API Endpoints</h2>
            <div className="endpoint-grid">
              <div className="endpoint-card">
                <h3>Authentication</h3>
                <ul>
                  <li><code>POST /api/auth/register</code> - Register new user</li>
                  <li><code>POST /api/auth/login</code> - Login</li>
                  <li><code>GET /api/auth/me</code> - Get current user</li>
                </ul>
              </div>
              <div className="endpoint-card">
                <h3>Farms</h3>
                <ul>
                  <li><code>GET /api/farms</code> - List farms (paginated)</li>
                  <li><code>GET /api/farms/list</code> - List all farms</li>
                  <li><code>GET /api/farms/:id</code> - Get farm details</li>
                  <li><code>POST /api/farms</code> - Create farm</li>
                  <li><code>PUT /api/farms/:id</code> - Update farm</li>
                  <li><code>DELETE /api/farms/:id</code> - Delete farm</li>
                </ul>
              </div>
              <div className="endpoint-card">
                <h3>Crop Cycles</h3>
                <ul>
                  <li><code>GET /api/crops/farm/:farmId</code> - List crop cycles</li>
                  <li><code>POST /api/crops</code> - Create crop cycle</li>
                  <li><code>PUT /api/crops/:id</code> - Update crop cycle</li>
                </ul>
              </div>
              <div className="endpoint-card">
                <h3>Recommendations</h3>
                <ul>
                  <li><code>POST /api/recommendations</code> - Request recommendation</li>
                  <li><code>GET /api/recommendations?farmId=</code> - List recommendations</li>
                  <li><code>POST /api/recommendations/:id/execute</code> - Execute recommendation</li>
                </ul>
              </div>
              <div className="endpoint-card">
                <h3>Weather</h3>
                <ul>
                  <li><code>POST /api/weather</code> - Add weather observation</li>
                  <li><code>GET /api/weather/farm/:farmId</code> - Get observations</li>
                  <li><code>GET /api/weather/farm/:farmId/latest</code> - Latest observations</li>
                </ul>
              </div>
              <div className="endpoint-card">
                <h3>ML Service</h3>
                <ul>
                  <li><code>GET /health</code> - Health check</li>
                  <li><code>POST /predict/irrigation</code> - Get irrigation prediction</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer className="app-footer">
        <div className="container">
          <p>JALRAKSHAK &copy; 2024 - Part of KrishiSetu Initiative</p>
        </div>
      </footer>
    </>
  );
}

export default App;
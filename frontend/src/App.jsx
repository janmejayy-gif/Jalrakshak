import './App.css'

function App() {
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
          <section className="status-cards">
            <div className="card">
              <h2>Backend API</h2>
              <p>Spring Boot service</p>
              <a href="http://localhost:8080/api/health" target="_blank" rel="noopener noreferrer">
                Health Check
              </a>
            </div>
            <div className="card">
              <h2>ML Service</h2>
              <p>FastAPI inference service</p>
              <a href="http://localhost:8000/health" target="_blank" rel="noopener noreferrer">
                Health Check
              </a>
            </div>
            <div className="card">
              <h2>Database</h2>
              <p>PostgreSQL</p>
              <span className="status">Configure via .env</span>
            </div>
          </section>
          <section className="info">
            <h2>Getting Started</h2>
            <ol>
              <li>Copy <code>.env.example</code> to <code>.env</code> in each service directory</li>
              <li>Configure database connection and API keys</li>
              <li>Start PostgreSQL database</li>
              <li>Run backend: <code>cd backend && ./gradlew bootRun</code></li>
              <li>Run ML service: <code>cd ml-service && source venv/bin/activate && uvicorn app.main:app --reload</code></li>
              <li>Run frontend: <code>cd frontend && npm run dev</code></li>
            </ol>
          </section>
        </div>
      </main>
      <footer className="app-footer">
        <div className="container">
          <p>JALRAKSHAK &copy; 2024 - Part of KrishiSetu Initiative</p>
        </div>
      </footer>
    </>
  )
}

export default App
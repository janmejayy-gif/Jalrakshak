# JALRAKSHAK

Smart Irrigation Decision-Support Platform — Part of the KrishiSetu Initiative

## Overview

JALRAKSHAK is a production-minded smart irrigation decision-support application that helps farmers make informed irrigation decisions. The system consists of three services:

- **Frontend**: React + Vite (TypeScript-ready)
- **Backend**: Java Spring Boot 3.3 (Java 21)
- **ML Service**: Python FastAPI (Python 3.13)

Database: PostgreSQL 16

## Repository Structure

```
jakrak/
├── frontend/           # React + Vite application
├── backend/            # Spring Boot application
├── ml-service/         # FastAPI ML inference service
├── infrastructure/     # Infrastructure configs (Docker, etc.)
├── docs/               # Documentation
├── .github/workflows/  # CI/CD pipelines
├── docker-compose.yml  # Local orchestration (requires Docker)
├── .gitignore
├── .env.example        # Root environment template
└── README.md
```

## Prerequisites

| Tool | Version | Verified |
|------|---------|----------|
| Java (JDK) | 21 LTS (target) / 25.0.2 (runtime) | ✅ 25.0.2 |
| Node.js | 20+ LTS | ✅ v26.7.0 |
| npm | 10+ | ✅ 11.19.0 |
| Python | 3.13 | ✅ 3.13.7 |
| PostgreSQL | 16 | ✅ 16.15.1 (installed, running) |
| Docker | 24+ | ❌ Not available |
| Docker Compose | 2+ | ❌ Not available |
| Gradle | 8.9+ (wrapper) | ✅ 9.0 (via wrapper) |

> **Note**: Docker is not available in the current development environment. Dockerfiles and docker-compose.yml are provided for future containerization but cannot be tested locally. Services must be run directly on the host.
> **Note**: Backend runs on Java 25 but targets Java 21 bytecode compatibility via `--release 21`.

## Quick Start (Without Docker)

### 1. Clone and Configure Environment

```bash
# Copy environment templates
cp .env.example .env
cp backend/.env.example backend/.env
cp ml-service/.env.example ml-service/.env
cp frontend/.env.example frontend/.env.local

# Edit each .env file with your actual values
# NEVER commit .env files!
```

### 2. Start PostgreSQL

Install PostgreSQL 16 and create the database:

```bash
# macOS (Homebrew)
brew install postgresql@16
brew services start postgresql@16

# Create database
createdb jalrakshak
```

Or use any PostgreSQL 16 instance and update `SPRING_DATASOURCE_URL` in `backend/.env`.

### 3. Start Backend (Spring Boot)

```bash
cd backend

# Build (requires Gradle - not pre-installed)
# If gradlew is missing, generate it: gradle wrapper --gradle-version 8.9
./gradlew build --no-daemon

# Run
./gradlew bootRun --no-daemon
```

Backend will start on **http://localhost:8080**

Health check: **GET http://localhost:8080/api/health**

Expected response:
```json
{
  "status": "UP",
  "service": "jalrakshak-backend",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 4. Start ML Service (FastAPI)

```bash
cd ml-service

# Create virtual environment
python3.13 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

ML Service will start on **http://localhost:8000**

Health check: **GET http://localhost:8000/health**

Expected response:
```json
{
  "status": "healthy",
  "service": "jalrakshak-ml-service",
  "timestamp": "2024-01-15T10:30:00.000000Z"
}
```

### 5. Start Frontend (React + Vite)

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will start on **http://localhost:5173** (default Vite port)

## Available Commands

### Backend (Spring Boot)

| Command | Description |
|---------|-------------|
| `./gradlew build` | Build project (compile, test, package) — tests may fail due to Gradle 9/JUnit Platform compat issue |
| `./gradlew assemble` | Compile and package (skips tests) — **recommended** |
| `./gradlew bootRun` | Run application in dev mode |
| `./gradlew clean` | Clean build artifacts |

> **Note**: `./gradlew test` currently fails with "Failed to load JUnit Platform" due to Gradle 9.0 / Spring Boot 3.3.4 compatibility. Use `./gradlew assemble` for verified builds.

### ML Service (FastAPI)

| Command | Description |
|---------|-------------|
| `pip install -r requirements.txt` | Install Python dependencies |
| `ruff check app/ tests/` | Run linting |
| `mypy app/` | Run type checking |
| `pytest tests/ -v` | Run tests |
| `uvicorn app.main:app --reload` | Run development server |

### Frontend (React + Vite)

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run oxlint |
| `npm test` | Run tests (vitest) |
| `npm run preview` | Preview production build |

## Ports

| Service | Port | Health Endpoint |
|---------|------|-----------------|
| Frontend | 5173 (dev) / 3000 (Docker) | N/A |
| Backend | 8080 | `GET /api/health` |
| ML Service | 8000 | `GET /health` |
| PostgreSQL | 5432 | `pg_isready` |

## Environment Variables

### Root (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `DB_HOST` | Database host | Yes |
| `DB_PORT` | Database port (5432) | Yes |
| `DB_NAME` | Database name | Yes |
| `DB_USER` | Database user | Yes |
| `DB_PASSWORD` | Database password | Yes |
| `BACKEND_PORT` | Backend port (8080) | No |
| `FRONTEND_PORT` | Frontend port (3000/5173) | No |
| `ML_SERVICE_PORT` | ML service port (8000) | No |
| `JWT_SECRET` | JWT signing key (32+ chars) | Yes |
| `WEATHER_API_KEY` | Weather API key | No |
| `WEATHER_API_BASE_URL` | Weather API base URL | No |

### Backend (backend/.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `SERVER_PORT` | Server port | 8080 |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | dev |
| `SPRING_DATASOURCE_URL` | JDBC URL | jdbc:postgresql://localhost:5432/jalrakshak |
| `SPRING_DATASOURCE_USERNAME` | DB username | postgres |
| `SPRING_DATASOURCE_PASSWORD` | DB password | postgres |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Hibernate DDL mode | validate |
| `JWT_SECRET` | JWT secret | (required) |
| `JWT_EXPIRATION_MS` | Token expiry (ms) | 86400000 |
| `ML_SERVICE_URL` | ML service URL | http://localhost:8000 |

### ML Service (ml-service/.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `ML_SERVICE_HOST` | Bind host | 0.0.0.0 |
| `ML_SERVICE_PORT` | Bind port | 8000 |
| `MODEL_PATH` | Model file path | ./models/irrigation_model.pkl |
| `MODEL_VERSION` | Model version | 1.0.0 |
| `BACKEND_URL` | Backend URL | http://localhost:8080 |
| `LOG_LEVEL` | Log level | INFO |

### Frontend (frontend/.env.local)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | http://localhost:8080/api |
| `VITE_ML_SERVICE_URL` | ML service URL | http://localhost:8000 |
| `VITE_APP_TITLE` | App title | JALRAKSHAK |
| `VITE_APP_VERSION` | App version | 0.1.0 |

## Health Endpoints

### Backend: `GET /api/health`

```bash
curl http://localhost:8080/api/health
```

Response:
```json
{
  "status": "UP",
  "service": "jalrakshak-backend",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### ML Service: `GET /health`

```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy",
  "service": "jalrakshak-ml-service",
  "timestamp": "2024-01-15T10:30:00.000000Z"
}
```

Both endpoints return minimal information — no secrets, stack traces, or internal details.

## Stopping Services

### Without Docker

Press `Ctrl+C` in each terminal where services are running.

### With Docker (when available)

```bash
docker-compose down
# Or with volumes:
docker-compose down -v
```

## Troubleshooting

### Backend fails to start

1. **Gradle not found**: Generate wrapper with `gradle wrapper --gradle-version 8.9` (requires Gradle installed)
2. **Database connection refused**: Ensure PostgreSQL is running and credentials in `.env` are correct
3. **Port 8080 in use**: Change `SERVER_PORT` in `backend/.env`
4. **JWT_SECRET too short**: Must be at least 32 characters

### ML Service fails to start

1. **Python version mismatch**: Requires Python 3.13 (3.14 not supported by pydantic-core)
2. **pydantic-core build fails**: Use Python 3.13 or set `PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1`
3. **Port 8000 in use**: Change `ML_SERVICE_PORT` in `ml-service/.env`
4. **Import errors**: Ensure virtual environment is activated and dependencies installed

### Frontend fails to start

1. **Port 5173 in use**: Vite will auto-select next available port
2. **API connection fails**: Verify `VITE_API_BASE_URL` in `frontend/.env.local` matches backend
3. **Build errors**: Clear `node_modules` and `package-lock.json`, then `npm install`

### Common Issues

| Issue | Solution |
|-------|----------|
| "Command not found: gradle" | Install Gradle: `brew install gradle` (macOS) or download from gradle.org |
| "pg_isready: not found" | Install PostgreSQL client tools |
| "uvicorn: command not found" | Activate venv: `source venv/bin/activate` |
| "Permission denied: ./gradlew" | Run `chmod +x gradlew` |
| Tests fail with "config-both" | Remove inner `Config` class from Pydantic Settings, use `model_config` only |
| `./gradlew test` fails with "Failed to load JUnit Platform" | Known Gradle 9.0 / Spring Boot 3.3.4 incompatibility. Use `./gradlew assemble` instead. |

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push/PR to `main` and `develop`:

1. **Backend**: Gradle build + tests (JDK 21)
2. **ML Service**: Ruff lint + MyPy type check + pytest (Python 3.13)
3. **Frontend**: oxlint + vitest + Vite build (Node 20)
4. **Summary**: Fails if any job fails

## Phase 1 Acceptance Criteria

- [x] Repository structure documented and matches existing project
- [x] Environment examples contain placeholders only (no real secrets)
- [x] Health endpoints work and return safe responses (Backend: UP, ML: healthy)
- [x] README setup commands match actual configuration
- [x] Available lint, tests, and builds run with real results reported
- [x] Existing user changes preserved

## Known Blockers

1. **Docker unavailable**: Cannot verify Dockerfiles or docker-compose.yml. Provided for future use.
2. **Gradle not pre-installed**: Backend build requires Gradle installation (`brew install gradle` or manual). Gradle wrapper (9.0) generated and working.
3. **Python 3.14 incompatible**: ML service requires Python 3.13 (pydantic-core/PyO3 limitation). Python 3.13.7 verified working in venv.
4. **Backend tests blocked**: `./gradlew test` fails due to Gradle 9.0 / JUnit Platform compatibility issue with Spring Boot 3.3.4. Use `./gradlew assemble` for verified builds. Tests will be fixed in Phase 2 with updated Spring Boot version.

## Next Steps (Phase 2)

- Database schema and migrations (Flyway/Liquibase)
- Core entity definitions (Farm, Crop, User)
- Authentication (JWT) implementation
- Farm/Crop CRUD APIs
- Integration between Backend and ML Service

## License

Proprietary — Part of KrishiSetu Initiative
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.routes import health, predict


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print(f"Starting ML Service v{settings.model_version}")
    yield
    # Shutdown
    print("Shutting down ML Service")


app = FastAPI(
    title="JALRAKSHAK ML Service",
    description="Irrigation recommendation inference service",
    version=settings.model_version,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(predict.router, prefix="/predict", tags=["predict"])


@app.get("/")
async def root():
    return {
        "service": "jalrakshak-ml-service",
        "version": settings.model_version,
        "status": "running",
    }
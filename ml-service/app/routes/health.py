from fastapi import APIRouter
from datetime import datetime, UTC

router = APIRouter()


@router.get("")
async def health_check():
    return {
        "status": "healthy",
        "service": "jalrakshak-ml-service",
        "timestamp": datetime.now(UTC).isoformat(),
    }
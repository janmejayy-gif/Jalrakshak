from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Literal
from datetime import datetime, UTC

router = APIRouter()


class IrrigationRequest(BaseModel):
    farm_id: str = Field(..., description="Unique identifier for the farm")
    crop_type: str = Field(..., description="Type of crop")
    soil_moisture: float = Field(..., ge=0, le=100, description="Soil moisture percentage")
    temperature: float = Field(..., description="Current temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity percentage")
    rainfall_forecast: float = Field(..., ge=0, description="Forecasted rainfall in mm")
    crop_stage: str = Field(..., description="Current crop growth stage")


class IrrigationResponse(BaseModel):
    recommendation: Literal["IRRIGATE", "WAIT", "PARTIAL_IRRIGATION", "INSUFFICIENT_DATA"]
    confidence: float = Field(..., ge=0, le=1)
    reasoning: str
    timestamp: str


@router.post("/irrigation", response_model=IrrigationResponse)
async def predict_irrigation(request: IrrigationRequest):
    """
    Placeholder endpoint for irrigation recommendation.
    Actual ML model inference will be implemented in Phase 7.
    """
    return IrrigationResponse(
        recommendation="INSUFFICIENT_DATA",
        confidence=0.0,
        reasoning="ML model not yet implemented. This is a placeholder for Phase 7.",
        timestamp=datetime.now(UTC).isoformat(),
    )
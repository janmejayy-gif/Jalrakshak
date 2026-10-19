from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Literal, Optional
from datetime import datetime, UTC

router = APIRouter()


class IrrigationRequest(BaseModel):
    farmId: str = Field(..., description="Unique identifier for the farm")
    cropType: str = Field(..., description="Type of crop")
    soilMoisture: float = Field(..., ge=0, le=100, description="Soil moisture percentage")
    temperature: float = Field(..., description="Current temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity percentage")
    rainfallForecast: float = Field(..., ge=0, description="Forecasted rainfall in mm")
    cropStage: str = Field(..., description="Current crop growth stage")
    growthStage: Optional[str] = Field(None, description="Current crop growth stage detail")


class IrrigationResponse(BaseModel):
    recommendation: Literal["IRRIGATE", "WAIT", "PARTIAL_IRRIGATION", "INSUFFICIENT_DATA"]
    confidence: float = Field(..., ge=0, le=1)
    reasoning: str
    irrigationAmountMm: Optional[float] = Field(None, ge=0, description="Recommended irrigation amount in mm")
    modelVersion: str = Field(..., description="Model version used for prediction")
    timestamp: str


@router.post("/irrigation", response_model=IrrigationResponse)
async def predict_irrigation(request: IrrigationRequest):
    """
    Irrigation recommendation endpoint.
    Returns a baseline recommendation based on simple heuristics.
    Actual ML model inference will be implemented in Phase 7.
    """
    try:
        # Simple heuristic-based recommendation (baseline)
        soil_moisture = request.soilMoisture
        rainfall_forecast = request.rainfallForecast
        
        if soil_moisture < 20 and rainfall_forecast < 5:
            recommendation = "IRRIGATE"
            confidence = 0.85
            reasoning = f"Soil moisture critically low at {soil_moisture}% with minimal rainfall forecast ({rainfall_forecast}mm). Irrigation strongly recommended."
            irrigation_amount = 25.0
        elif soil_moisture < 35 and rainfall_forecast < 10:
            recommendation = "PARTIAL_IRRIGATION"
            confidence = 0.75
            reasoning = f"Soil moisture low at {soil_moisture}% with limited rainfall forecast ({rainfall_forecast}mm). Partial irrigation recommended."
            irrigation_amount = 15.0
        elif soil_moisture > 70 or rainfall_forecast > 20:
            recommendation = "WAIT"
            confidence = 0.80
            reasoning = f"Soil moisture adequate at {soil_moisture}% or significant rainfall forecast ({rainfall_forecast}mm). Irrigation not needed at this time."
            irrigation_amount = None
        else:
            recommendation = "INSUFFICIENT_DATA"
            confidence = 0.50
            reasoning = "Conditions ambiguous. Additional sensor data or weather forecast needed for confident recommendation."
            irrigation_amount = None
        
        return IrrigationResponse(
            recommendation=recommendation,
            confidence=confidence,
            reasoning=reasoning,
            irrigationAmountMm=irrigation_amount,
            modelVersion="baseline-heuristic-v1",
            timestamp=datetime.now(UTC).isoformat(),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "jalrakshak-ml-service",
        "timestamp": datetime.now(UTC).isoformat(),
    }
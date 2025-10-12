"""
Statistics Router
API endpoints for life statistics calculations
"""
from fastapi import APIRouter, HTTPException, Depends
from datetime import date
from sqlalchemy.orm import Session

from app.schemas.stats import BirthdateRequest, LifeStatsResponse
from app.services.stats_service import stats_service
from app.services.view_count_service import ViewCountService
from app.core.database import get_db

router = APIRouter()


@router.post("/calculate", response_model=LifeStatsResponse)
async def calculate_stats(
    birthdate: BirthdateRequest,
    db: Session = Depends(get_db)
) -> LifeStatsResponse:
    """
    Calculate life statistics based on birthdate

    Args:
        birthdate: Birth date information (year, month, day)

    Returns:
        Comprehensive life statistics

    Raises:
        HTTPException: If birthdate is invalid or in the future
    """
    try:
        # Validate that the date is valid
        birthdate_obj = birthdate.to_date()

        # Check if birthdate is in the future
        if birthdate_obj > date.today():
            raise HTTPException(
                status_code=400,
                detail="생년월일은 미래 날짜일 수 없습니다."
            )

        # Calculate statistics
        stats = stats_service.calculate_life_stats(birthdate)

        # Increment stats calculated count
        view_count_service = ViewCountService(db)
        view_count_service.increment_stats_calculated()

        return stats

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"유효하지 않은 날짜입니다: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"통계 계산 중 오류가 발생했습니다: {str(e)}"
        )


@router.get("/test")
async def test_endpoint() -> dict[str, str]:
    """Test endpoint to verify router is working"""
    return {
        "message": "Stats router is working",
        "status": "ok"
    }

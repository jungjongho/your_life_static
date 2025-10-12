"""
View Count Router
API endpoints for view count tracking
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.view_count import ViewCountResponse, AllViewCountsResponse
from app.services.view_count_service import ViewCountService

router = APIRouter()


@router.post("/page-view", response_model=ViewCountResponse)
async def increment_page_view(db: Session = Depends(get_db)) -> ViewCountResponse:
    """
    Increment page view count

    Returns:
        Updated page view count
    """
    service = ViewCountService(db)
    return service.increment_page_view()


@router.post("/stats-calculated", response_model=ViewCountResponse)
async def increment_stats_calculated(db: Session = Depends(get_db)) -> ViewCountResponse:
    """
    Increment stats calculated count

    Returns:
        Updated stats calculated count
    """
    service = ViewCountService(db)
    return service.increment_stats_calculated()


@router.get("/all", response_model=AllViewCountsResponse)
async def get_all_counts(db: Session = Depends(get_db)) -> AllViewCountsResponse:
    """
    Get all view counts

    Returns:
        All view counts
    """
    service = ViewCountService(db)
    return service.get_all_counts()


@router.get("/{event_type}", response_model=ViewCountResponse)
async def get_count_by_type(
    event_type: str,
    db: Session = Depends(get_db)
) -> ViewCountResponse:
    """
    Get count for specific event type

    Args:
        event_type: Type of event (page_view, stats_calculated)

    Returns:
        Count for the specified event type
    """
    service = ViewCountService(db)
    return service.get_count_by_type(event_type)

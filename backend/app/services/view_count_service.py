"""
View Count Service
Business logic for view count operations
"""
from sqlalchemy.orm import Session

from app.repositories.view_count_repository import ViewCountRepository
from app.schemas.view_count import ViewCountResponse, AllViewCountsResponse


class ViewCountService:
    """Service for view count business logic"""

    # Event type constants
    PAGE_VIEW = "page_view"
    STATS_CALCULATED = "stats_calculated"

    def __init__(self, db: Session):
        self.repository = ViewCountRepository(db)

    def increment_page_view(self) -> ViewCountResponse:
        """
        Increment page view count

        Returns:
            ViewCountResponse with updated count
        """
        view_count = self.repository.increment(self.PAGE_VIEW)
        return ViewCountResponse.model_validate(view_count)

    def increment_stats_calculated(self) -> ViewCountResponse:
        """
        Increment stats calculated count

        Returns:
            ViewCountResponse with updated count
        """
        view_count = self.repository.increment(self.STATS_CALCULATED)
        return ViewCountResponse.model_validate(view_count)

    def get_all_counts(self) -> AllViewCountsResponse:
        """
        Get all view counts

        Returns:
            AllViewCountsResponse with all counts
        """
        all_counts = self.repository.get_all_counts()

        # Create a dictionary for easy lookup
        counts_dict = {vc.event_type: vc.count for vc in all_counts}

        return AllViewCountsResponse(
            total_page_views=counts_dict.get(self.PAGE_VIEW, 0),
            total_stats_calculated=counts_dict.get(self.STATS_CALCULATED, 0)
        )

    def get_count_by_type(self, event_type: str) -> ViewCountResponse:
        """
        Get count for specific event type

        Args:
            event_type: Type of event to get count for

        Returns:
            ViewCountResponse with count
        """
        view_count = self.repository.get_by_event_type(event_type)

        if view_count is None:
            # Return zero count if not found
            from app.models.view_count import ViewCount
            from datetime import datetime
            view_count = ViewCount(
                event_type=event_type,
                count=0,
                updated_at=datetime.utcnow()
            )

        return ViewCountResponse.model_validate(view_count)

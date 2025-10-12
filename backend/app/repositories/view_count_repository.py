"""
View Count Repository
Data access layer for view count operations
"""
from typing import Optional
from sqlalchemy.orm import Session

from app.models.view_count import ViewCount


class ViewCountRepository:
    """Repository for view count database operations"""

    def __init__(self, db: Session):
        self.db = db

    def get_by_event_type(self, event_type: str) -> Optional[ViewCount]:
        """
        Get view count by event type

        Args:
            event_type: Type of event to get count for

        Returns:
            ViewCount object or None if not found
        """
        return self.db.query(ViewCount).filter(
            ViewCount.event_type == event_type
        ).first()

    def increment(self, event_type: str) -> ViewCount:
        """
        Increment view count for an event type

        Args:
            event_type: Type of event to increment

        Returns:
            Updated ViewCount object
        """
        view_count = self.get_by_event_type(event_type)

        if view_count is None:
            # Create new entry if it doesn't exist
            view_count = ViewCount(event_type=event_type, count=1)
            self.db.add(view_count)
        else:
            # Increment existing count
            view_count.count += 1

        self.db.commit()
        self.db.refresh(view_count)
        return view_count

    def get_all_counts(self) -> list[ViewCount]:
        """
        Get all view counts

        Returns:
            List of all ViewCount objects
        """
        return self.db.query(ViewCount).all()

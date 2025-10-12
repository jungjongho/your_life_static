"""
View Count Model
SQLAlchemy model for tracking service view counts
"""
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.core.database import Base


class ViewCount(Base):
    """View count tracking model"""

    __tablename__ = "view_counts"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String, index=True, nullable=False)  # 'page_view', 'stats_calculated', etc.
    count = Column(Integer, default=0, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self) -> str:
        return f"<ViewCount(event_type='{self.event_type}', count={self.count})>"

"""
View Count Schemas
Pydantic models for view count request/response validation
"""
from datetime import datetime
from pydantic import BaseModel, Field


class ViewCountResponse(BaseModel):
    """Response schema for view count"""
    event_type: str = Field(..., description="Type of event")
    count: int = Field(..., description="Current count")
    updated_at: datetime = Field(..., description="Last updated timestamp")

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "event_type": "stats_calculated",
                "count": 1234,
                "updated_at": "2024-01-12T10:30:00"
            }
        }


class AllViewCountsResponse(BaseModel):
    """Response schema for all view counts"""
    total_page_views: int = Field(..., description="Total page views")
    total_stats_calculated: int = Field(..., description="Total stats calculations")

    class Config:
        json_schema_extra = {
            "example": {
                "total_page_views": 5678,
                "total_stats_calculated": 1234
            }
        }

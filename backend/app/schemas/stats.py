"""
Statistics Schemas
Pydantic models for request/response validation
"""
from datetime import date
from pydantic import BaseModel, Field, field_validator


class BirthdateRequest(BaseModel):
    """Request schema for birthdate input"""
    year: int = Field(..., ge=1900, description="Birth year (1900 or later)")
    month: int = Field(..., ge=1, le=12, description="Birth month (1-12)")
    day: int = Field(..., ge=1, le=31, description="Birth day (1-31)")

    @field_validator('year')
    @classmethod
    def validate_not_future(cls, v: int) -> int:
        """Validate year is not in the future"""
        current_year = date.today().year
        if v > current_year:
            raise ValueError(f"Birth year cannot be in the future (current: {current_year})")
        return v

    def to_date(self) -> date:
        """Convert to Python date object"""
        return date(self.year, self.month, self.day)


class LifeStatsResponse(BaseModel):
    """Response schema for life statistics"""
    total_days: int = Field(..., description="Total days lived")
    total_hours: int = Field(..., description="Total hours lived")
    total_minutes: int = Field(..., description="Total minutes lived")
    total_seconds: int = Field(..., description="Total seconds lived")
    heartbeats: int = Field(..., description="Estimated total heartbeats")
    breaths: int = Field(..., description="Estimated total breaths taken")
    sleep_hours: int = Field(..., description="Estimated total hours slept")
    meals_eaten: int = Field(..., description="Estimated total meals eaten")
    days_until_next_birthday: int = Field(..., description="Days until next birthday")
    days_until_next_milestone: int = Field(..., description="Days until next 10,000-day milestone")
    next_milestone: int = Field(..., description="Next milestone number (e.g., 10000, 20000)")
    age_years: int = Field(..., description="Current age in years")

    class Config:
        json_schema_extra = {
            "example": {
                "total_days": 10000,
                "total_hours": 240000,
                "total_minutes": 14400000,
                "total_seconds": 864000000,
                "heartbeats": 1036800000,
                "breaths": 216000000,
                "sleep_hours": 80000,
                "meals_eaten": 30000,
                "days_until_next_birthday": 45,
                "days_until_next_milestone": 0,
                "next_milestone": 10000,
                "age_years": 27
            }
        }

"""
Statistics Service
Business logic for calculating life statistics
"""
from datetime import date, datetime, timedelta
from typing import Tuple

from app.schemas.stats import BirthdateRequest, LifeStatsResponse


class StatsService:
    """Service for calculating life statistics"""

    # Constants
    HEART_RATE_PER_MINUTE = 72
    BREATHS_PER_MINUTE = 15
    SLEEP_HOURS_PER_DAY = 8
    MEALS_PER_DAY = 3
    MILESTONE_DAYS = 10000

    def calculate_life_stats(self, birthdate_req: BirthdateRequest) -> LifeStatsResponse:
        """
        Calculate comprehensive life statistics based on birthdate

        Args:
            birthdate_req: Birthdate request with year, month, day

        Returns:
            LifeStatsResponse with all calculated statistics
        """
        birthdate = birthdate_req.to_date()
        today = date.today()

        # Calculate total days lived
        total_days = (today - birthdate).days

        # Calculate time units
        total_hours = total_days * 24
        total_minutes = total_hours * 60
        total_seconds = total_minutes * 60

        # Calculate biological statistics
        heartbeats = total_minutes * self.HEART_RATE_PER_MINUTE
        breaths = total_minutes * self.BREATHS_PER_MINUTE
        sleep_hours = total_days * self.SLEEP_HOURS_PER_DAY
        meals_eaten = total_days * self.MEALS_PER_DAY

        # Calculate days until next birthday
        days_until_next_birthday = self._calculate_days_until_next_birthday(birthdate, today)

        # Calculate milestone information
        days_until_next_milestone, next_milestone = self._calculate_milestone_info(total_days)

        # Calculate age in years
        age_years = self._calculate_age_in_years(birthdate, today)

        return LifeStatsResponse(
            total_days=total_days,
            total_hours=total_hours,
            total_minutes=total_minutes,
            total_seconds=total_seconds,
            heartbeats=heartbeats,
            breaths=breaths,
            sleep_hours=sleep_hours,
            meals_eaten=meals_eaten,
            days_until_next_birthday=days_until_next_birthday,
            days_until_next_milestone=days_until_next_milestone,
            next_milestone=next_milestone,
            age_years=age_years
        )

    def _calculate_days_until_next_birthday(self, birthdate: date, today: date) -> int:
        """Calculate days until next birthday"""
        # Get this year's birthday
        this_year_birthday = date(today.year, birthdate.month, birthdate.day)

        # If birthday hasn't occurred this year yet
        if today <= this_year_birthday:
            return (this_year_birthday - today).days

        # Otherwise, calculate for next year
        next_year_birthday = date(today.year + 1, birthdate.month, birthdate.day)
        return (next_year_birthday - today).days

    def _calculate_milestone_info(self, total_days: int) -> Tuple[int, int]:
        """
        Calculate days until next milestone and the milestone value

        Returns:
            Tuple of (days_until_next_milestone, next_milestone)
        """
        # Calculate next milestone (in increments of 10,000)
        next_milestone = ((total_days // self.MILESTONE_DAYS) + 1) * self.MILESTONE_DAYS
        days_until_next_milestone = next_milestone - total_days

        return days_until_next_milestone, next_milestone

    def _calculate_age_in_years(self, birthdate: date, today: date) -> int:
        """Calculate age in years"""
        age = today.year - birthdate.year

        # Adjust if birthday hasn't occurred this year yet
        if (today.month, today.day) < (birthdate.month, birthdate.day):
            age -= 1

        return age


# Service instance
stats_service = StatsService()

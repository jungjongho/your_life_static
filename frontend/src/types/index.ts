/**
 * Type definitions for My Life Stats
 */

export interface Birthdate {
  year: number;
  month: number;
  day: number;
}

export interface LifeStats {
  total_days: number;
  total_hours: number;
  total_minutes: number;
  total_seconds: number;
  heartbeats: number;
  breaths: number;
  sleep_hours: number;
  meals_eaten: number;
  days_until_next_birthday: number;
  days_until_next_milestone: number;
  next_milestone: number;
  age_years: number;
}

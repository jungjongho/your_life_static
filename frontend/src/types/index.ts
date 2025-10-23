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

// Compatibility Types
export interface PersonInfo {
  birth_year: number;
  birth_month: number;
  birth_day: number;
  birth_hour?: number;
  gender?: 'male' | 'female';
  name?: string;
}

export interface CompatibilityRequest {
  person1: PersonInfo;
  person2: PersonInfo;
  language: 'ko' | 'en';
}

export interface CompatibilityResponse {
  score: number;
  summary: string;
  strengths: string[];
  cautions: string[];
  elements_analysis: string;
  zodiac_compatibility: string;
  advice: string;
}

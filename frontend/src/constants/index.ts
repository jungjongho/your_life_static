/**
 * Application Constants
 * Centralized configuration for all magic numbers and constants
 */

// ============================================
// Life Statistics Calculation Constants
// ============================================

/** Average heart rate per minute for life statistics calculation */
export const HEART_RATE_PER_MINUTE = 72;

/** Average breaths per minute for life statistics calculation */
export const BREATHS_PER_MINUTE = 15;

/** Average sleep hours per day for life statistics calculation */
export const SLEEP_HOURS_PER_DAY = 8;

/** Average meals per day for life statistics calculation */
export const MEALS_PER_DAY = 3;

/** Minimum birth year allowed for date validation */
export const MIN_BIRTH_YEAR = 1900;

/** Days per year for milestone calculations (including leap day average) */
export const DAYS_PER_YEAR = 365;

// ============================================
// Anniversary Milestone Configuration
// ============================================

/** Milestone configuration for anniversary countdowns */
export interface MilestoneConfig {
  days: number;
  icon: string;
  labelKey: string;
}

/** Ordered list of anniversary milestones to display */
export const ANNIVERSARY_MILESTONES: MilestoneConfig[] = [
  { days: 100, icon: '💯', labelKey: 'milestone100' },
  { days: 200, icon: '🎊', labelKey: 'milestone200' },
  { days: 500, icon: '🎁', labelKey: 'milestone500' },
  { days: 1000, icon: '💎', labelKey: 'milestone1000' },
  { days: DAYS_PER_YEAR * 5, icon: '🏆', labelKey: 'milestone5years' },
];

/** Base milestone for recurring 10,000-day celebrations */
export const MILESTONE_DAYS = 10000;

// ============================================
// Animation Constants
// ============================================

/** Duration of stat card count-up animation in milliseconds */
export const STAT_ANIMATION_DURATION = 2000;

/** Number of steps in the count-up animation (higher = smoother) */
export const STAT_ANIMATION_STEPS = 60;

// ============================================
// UI Timing Constants
// ============================================

/** Toast notification display duration in milliseconds */
export const TOAST_DURATION = 3000;

/** Delay before refreshing view counts after calculation (milliseconds) */
export const VIEW_COUNT_REFRESH_DELAY = 500;

// ============================================
// API Configuration
// ============================================

/** Base URL for backend API requests */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8050';

/** API endpoint paths */
export const API_ENDPOINTS = {
  HEALTH: '/health',
  CALCULATE_STATS: '/api/v1/stats/calculate',
  PAGE_VIEW: '/api/v1/views/page-view',
  ALL_VIEWS: '/api/v1/views/all',
} as const;

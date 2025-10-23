/**
 * View Count Service
 * Handles tracking and retrieval of application usage statistics
 *
 * @module services/viewCount
 */

import { API_BASE_URL, API_ENDPOINTS } from '@/constants';

/**
 * Represents a single view count event
 */
export interface ViewCount {
  event_type: string;
  count: number;
  updated_at: string;
}

/**
 * Represents aggregated view counts
 */
export interface AllViewCounts {
  /** Total number of page views across all visits */
  total_page_views: number;
  /** Total number of statistics calculations performed */
  total_stats_calculated: number;
}

/**
 * View count tracking service
 * Provides methods for incrementing and retrieving usage statistics
 */
export const viewCountService = {
  /**
   * Increments the page view counter
   * @returns Promise resolving to updated view count
   * @throws Error if increment fails
   */
  async incrementPageView(): Promise<ViewCount> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.PAGE_VIEW}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to increment page view');
    }

    return response.json();
  },

  /**
   * Retrieves all view count statistics
   * @returns Promise resolving to aggregated view counts
   * @throws Error if retrieval fails
   */
  async getAllCounts(): Promise<AllViewCounts> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.ALL_VIEWS}`);

    if (!response.ok) {
      throw new Error('Failed to get view counts');
    }

    return response.json();
  },
};

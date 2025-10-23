/**
 * API Service
 * Handles all backend API communications for life statistics
 *
 * @module services/api
 */

import { Birthdate, LifeStats } from '@/types';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants';

/**
 * Life statistics API service
 * Provides methods for health checks and statistics calculations
 */
export const apiService = {
  /**
   * Performs a health check on the backend API
   * @returns Promise resolving to health status
   * @throws Error if API is unreachable or unhealthy
   */
  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.HEALTH}`);
    if (!response.ok) {
      throw new Error('API health check failed');
    }
    return response.json();
  },

  /**
   * Calculates life statistics based on birthdate
   * @param birthdate - User's birthdate information
   * @returns Promise resolving to calculated life statistics
   * @throws Error if calculation fails or invalid data provided
   */
  async calculateStats(birthdate: Birthdate): Promise<LifeStats> {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CALCULATE_STATS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(birthdate),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || '통계 계산에 실패했습니다.');
    }

    return response.json();
  },
};

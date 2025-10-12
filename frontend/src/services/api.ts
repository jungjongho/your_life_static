/**
 * API Service
 * Backend API 호출을 담당하는 서비스
 */

import { Birthdate, LifeStats } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8050';

export const apiService = {
  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_URL}/health`);
    if (!response.ok) {
      throw new Error('API health check failed');
    }
    return response.json();
  },

  async calculateStats(birthdate: Birthdate): Promise<LifeStats> {
    const response = await fetch(`${API_URL}/api/v1/stats/calculate`, {
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

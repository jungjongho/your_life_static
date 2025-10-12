/**
 * useLifeStats Hook
 * Manages life statistics calculation and state
 */
'use client';

import { useState } from 'react';
import { Birthdate, LifeStats } from '@/types';
import { apiService } from '@/services/api';

interface UseLifeStatsReturn {
  stats: LifeStats | null;
  loading: boolean;
  error: string | null;
  calculateStats: (birthdate: Birthdate) => Promise<void>;
  reset: () => void;
}

export function useLifeStats(): UseLifeStatsReturn {
  const [stats, setStats] = useState<LifeStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateStats = async (birthdate: Birthdate) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.calculateStats(birthdate);
      setStats(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStats(null);
    setError(null);
    setLoading(false);
  };

  return {
    stats,
    loading,
    error,
    calculateStats,
    reset,
  };
}

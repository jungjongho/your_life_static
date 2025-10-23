/**
 * useLifeStats Hook
 * Manages life statistics calculation state and API interactions
 * Provides loading, error, and data state management for statistics calculation
 *
 * @module hooks/useLifeStats
 */
'use client';

import { useState } from 'react';
import { Birthdate, LifeStats } from '@/types';
import { apiService } from '@/services/api';
import { getErrorMessage } from '@/utils/errorHandling';

/**
 * Return type for useLifeStats hook
 */
export interface UseLifeStatsReturn {
  /** Calculated life statistics (null if not yet calculated) */
  stats: LifeStats | null;
  /** Loading state during API call */
  loading: boolean;
  /** Error message if calculation failed */
  error: string | null;
  /** Function to trigger statistics calculation */
  calculateStats: (birthdate: Birthdate) => Promise<void>;
  /** Reset all state to initial values */
  reset: () => void;
}

/**
 * Custom hook for managing life statistics calculation
 * Handles API calls, loading states, and error management
 *
 * @returns Object containing stats data, loading state, error state, and control functions
 *
 * @example
 * function StatsCalculator() {
 *   const { stats, loading, error, calculateStats } = useLifeStats();
 *
 *   const handleCalculate = async () => {
 *     await calculateStats({ year: 1990, month: 5, day: 15 });
 *   };
 *
 *   if (loading) return <Loading />;
 *   if (error) return <Error message={error} />;
 *   if (stats) return <StatsDisplay stats={stats} />;
 *   return <CalculateButton onClick={handleCalculate} />;
 * }
 */
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
      const errorMessage = getErrorMessage(err, '알 수 없는 오류가 발생했습니다.');
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

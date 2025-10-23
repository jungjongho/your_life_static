/**
 * useViewCount Hook
 * Manages view count tracking and display with automatic refresh
 * Fetches counts on mount and provides methods to increment and refresh
 *
 * @module hooks/useViewCount
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { viewCountService, AllViewCounts } from '@/services/viewCount';
import { getErrorMessage } from '@/utils/errorHandling';

/**
 * Return type for useViewCount hook
 */
export interface UseViewCountReturn {
  /** Current view count data */
  viewCounts: AllViewCounts | null;
  /** Loading state during API calls */
  loading: boolean;
  /** Error message if fetching failed */
  error: string | null;
  /** Increment page view counter */
  incrementPageView: () => Promise<void>;
  /** Manually refresh view counts */
  refreshCounts: () => Promise<void>;
}

/**
 * Custom hook for managing view count tracking
 * Automatically fetches counts on component mount
 * Provides increment and refresh functionality
 *
 * @returns Object containing view counts, loading state, error state, and control functions
 *
 * @example
 * function ViewCountDisplay() {
 *   const { viewCounts, loading, incrementPageView } = useViewCount();
 *
 *   useEffect(() => {
 *     incrementPageView();
 *   }, []);
 *
 *   if (loading) return <Loading />;
 *   return <div>Page Views: {viewCounts?.total_page_views}</div>;
 * }
 */
export function useViewCount(): UseViewCountReturn {
  const [viewCounts, setViewCounts] = useState<AllViewCounts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCounts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const counts = await viewCountService.getAllCounts();
      setViewCounts(counts);
    } catch (err) {
      const errorMessage = getErrorMessage(err, '조회수를 불러오는데 실패했습니다.');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const incrementPageView = useCallback(async () => {
    try {
      await viewCountService.incrementPageView();
      // Refresh counts after incrementing
      await fetchCounts();
    } catch (err) {
      console.error('Failed to increment page view:', err);
    }
  }, [fetchCounts]);

  const refreshCounts = useCallback(async () => {
    await fetchCounts();
  }, [fetchCounts]);

  // Fetch counts on mount
  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  return {
    viewCounts,
    loading,
    error,
    incrementPageView,
    refreshCounts,
  };
}

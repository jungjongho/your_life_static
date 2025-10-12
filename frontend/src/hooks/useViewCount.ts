/**
 * useViewCount Hook
 * Manages view count tracking and display
 */
'use client';

import { useState, useEffect } from 'react';
import { viewCountService, AllViewCounts } from '@/services/viewCount';

interface UseViewCountReturn {
  viewCounts: AllViewCounts | null;
  loading: boolean;
  error: string | null;
  incrementPageView: () => Promise<void>;
  refreshCounts: () => Promise<void>;
}

export function useViewCount(): UseViewCountReturn {
  const [viewCounts, setViewCounts] = useState<AllViewCounts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCounts = async () => {
    setLoading(true);
    setError(null);

    try {
      const counts = await viewCountService.getAllCounts();
      setViewCounts(counts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '조회수를 불러오는데 실패했습니다.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const incrementPageView = async () => {
    try {
      await viewCountService.incrementPageView();
      // Refresh counts after incrementing
      await fetchCounts();
    } catch (err) {
      console.error('Failed to increment page view:', err);
    }
  };

  const refreshCounts = async () => {
    await fetchCounts();
  };

  // Fetch counts on mount
  useEffect(() => {
    fetchCounts();
  }, []);

  return {
    viewCounts,
    loading,
    error,
    incrementPageView,
    refreshCounts,
  };
}

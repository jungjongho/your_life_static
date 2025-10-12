/**
 * View Count Service
 * API calls for view count tracking
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8050';

export interface ViewCount {
  event_type: string;
  count: number;
  updated_at: string;
}

export interface AllViewCounts {
  total_page_views: number;
  total_stats_calculated: number;
}

export const viewCountService = {
  async incrementPageView(): Promise<ViewCount> {
    const response = await fetch(`${API_URL}/api/v1/views/page-view`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Failed to increment page view');
    }

    return response.json();
  },

  async getAllCounts(): Promise<AllViewCounts> {
    const response = await fetch(`${API_URL}/api/v1/views/all`);

    if (!response.ok) {
      throw new Error('Failed to get view counts');
    }

    return response.json();
  },
};

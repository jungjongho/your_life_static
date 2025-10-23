/**
 * Compatibility Service
 * 사주 궁합 분석 API 호출
 */

import { CompatibilityRequest, CompatibilityResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8050';

/**
 * 사주 궁합 분석 요청
 *
 * @param request - 궁합 분석 요청 데이터
 * @returns 궁합 분석 결과
 */
export async function analyzeCompatibility(
  request: CompatibilityRequest
): Promise<CompatibilityResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/compatibility/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || `Failed to analyze compatibility: ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * 궁합 분석 서비스 헬스 체크
 *
 * @returns 서비스 상태
 */
export async function checkCompatibilityHealth(): Promise<{
  status: string;
  service: string;
  model: string;
}> {
  const response = await fetch(`${API_BASE_URL}/api/v1/compatibility/health`);

  if (!response.ok) {
    throw new Error('Compatibility service is not available');
  }

  return response.json();
}

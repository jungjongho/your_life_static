/**
 * URL Sharing Utility
 * Generate and copy shareable URLs with birthdate parameters
 */

import { Birthdate } from '@/types';

export function generateShareUrl(birthdate: Birthdate): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const params = new URLSearchParams({
    year: birthdate.year.toString(),
    month: birthdate.month.toString(),
    day: birthdate.day.toString(),
  });

  return `${baseUrl}?${params.toString()}`;
}

export async function copyUrlToClipboard(birthdate: Birthdate): Promise<void> {
  const url = generateShareUrl(birthdate);

  try {
    await navigator.clipboard.writeText(url);
  } catch (error) {
    console.error('Clipboard copy failed:', error);
    throw new Error('URL 복사에 실패했습니다.');
  }
}

export function getBirthdateFromUrl(): Birthdate | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const year = params.get('year');
  const month = params.get('month');
  const day = params.get('day');

  if (!year || !month || !day) return null;

  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);

  // Validate numbers
  if (isNaN(yearNum) || isNaN(monthNum) || isNaN(dayNum)) return null;
  if (monthNum < 1 || monthNum > 12) return null;
  if (dayNum < 1 || dayNum > 31) return null;

  return {
    year: yearNum,
    month: monthNum,
    day: dayNum,
  };
}

'use client';

import { useState, useEffect } from 'react';
import BirthdateInput from '@/components/molecules/BirthdateInput';
import StatsResult from '@/components/organisms/StatsResult';
import Button from '@/components/atoms/Button';
import ViewCounter from '@/components/atoms/ViewCounter';
import { useLifeStats } from '@/hooks/useLifeStats';
import { useViewCount } from '@/hooks/useViewCount';
import { getBirthdateFromUrl } from '@/utils/urlShare';
import { downloadAsImage } from '@/utils/imageDownload';
import { copyUrlToClipboard } from '@/utils/urlShare';

export default function Home() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);
  const [day, setDay] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { stats, loading, error, calculateStats, reset } = useLifeStats();
  const { viewCounts, incrementPageView, refreshCounts } = useViewCount();

  // Increment page view on mount
  useEffect(() => {
    incrementPageView();
  }, []);

  // Load birthdate from URL on mount
  useEffect(() => {
    const urlBirthdate = getBirthdateFromUrl();
    if (urlBirthdate) {
      setYear(urlBirthdate.year);
      setMonth(urlBirthdate.month);
      setDay(urlBirthdate.day);
      // Auto-calculate if all values are present
      calculateStats(urlBirthdate);
    }
  }, []);

  const handleCalculate = () => {
    if (!year || !month || !day) {
      showToastMessage('생년월일을 모두 입력해주세요.');
      return;
    }

    // Validate date
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      showToastMessage('유효하지 않은 날짜입니다.');
      return;
    }

    calculateStats({ year, month, day });
    // Refresh counts after calculation
    setTimeout(() => refreshCounts(), 500);
  };

  const handleReset = () => {
    reset();
    setYear(0);
    setMonth(0);
    setDay(0);
    // Clear URL parameters
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const handleDownloadImage = async () => {
    try {
      await downloadAsImage('stats-result', `my-life-stats-${year}${month}${day}.png`);
      showToastMessage('이미지가 다운로드되었습니다!');
    } catch (err) {
      showToastMessage('이미지 다운로드에 실패했습니다.');
    }
  };

  const handleShareUrl = async () => {
    try {
      await copyUrlToClipboard({ year, month, day });
      showToastMessage('URL이 클립보드에 복사되었습니다!');
    } catch (err) {
      showToastMessage('URL 복사에 실패했습니다.');
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* View Counter - Fixed at top */}
      {viewCounts && (
        <div className="fixed top-4 left-4 bg-white rounded-lg shadow-md p-3 z-40">
          <div className="flex flex-col gap-2">
            <ViewCounter
              label="총 방문"
              count={viewCounts.total_page_views}
              icon="🌍"
            />
            <ViewCounter
              label="계산 횟수"
              count={viewCounts.total_stats_calculated}
              icon="📊"
            />
          </div>
        </div>
      )}

      {!stats ? (
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <BirthdateInput
            year={year}
            month={month}
            day={day}
            onYearChange={setYear}
            onMonthChange={setMonth}
            onDayChange={setDay}
          />

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleCalculate}
              disabled={loading || !year || !month || !day}
              className="w-full md:w-auto px-12"
            >
              {loading ? '계산 중...' : '내 통계 보기'}
            </Button>
          </div>

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>🔒 입력하신 정보는 저장되지 않습니다</p>
          </div>
        </div>
      ) : (
        <StatsResult
          stats={stats}
          onReset={handleReset}
          onDownloadImage={handleDownloadImage}
          onShareUrl={handleShareUrl}
        />
      )}
    </main>
  );
}

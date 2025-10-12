/**
 * StatsResult Organism Component
 * Display all life statistics in a grid
 */
'use client';

import StatCard from '../atoms/StatCard';
import Button from '../atoms/Button';
import { LifeStats } from '@/types';

interface StatsResultProps {
  stats: LifeStats;
  onReset: () => void;
  onDownloadImage: () => void;
  onShareUrl: () => void;
}

export default function StatsResult({
  stats,
  onReset,
  onDownloadImage,
  onShareUrl,
}: StatsResultProps) {
  const statCards = [
    {
      icon: '🎂',
      label: '현재 나이',
      value: stats.age_years,
      unit: '세',
    },
    {
      icon: '📅',
      label: '살아온 날',
      value: stats.total_days,
      unit: '일',
    },
    {
      icon: '⏰',
      label: '살아온 시간',
      value: stats.total_hours,
      unit: '시간',
    },
    {
      icon: '⏱️',
      label: '살아온 분',
      value: stats.total_minutes,
      unit: '분',
    },
    {
      icon: '⚡',
      label: '살아온 초',
      value: stats.total_seconds,
      unit: '초',
    },
    {
      icon: '💓',
      label: '심장 박동',
      value: stats.heartbeats,
      unit: '회',
    },
    {
      icon: '🌬️',
      label: '숨 쉰 횟수',
      value: stats.breaths,
      unit: '회',
    },
    {
      icon: '😴',
      label: '잠잔 시간',
      value: stats.sleep_hours,
      unit: '시간',
    },
    {
      icon: '🍚',
      label: '먹은 밥',
      value: stats.meals_eaten,
      unit: '끼',
    },
    {
      icon: '🎉',
      label: '다음 생일까지',
      value: stats.days_until_next_birthday,
      unit: '일',
    },
    {
      icon: '🎯',
      label: `${stats.next_milestone.toLocaleString()}일까지`,
      value: stats.days_until_next_milestone,
      unit: '일 남음',
    },
  ];

  return (
    <div id="stats-result" className="w-full max-w-6xl">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            당신의 인생 통계
          </h1>
          <p className="text-gray-600">지금까지 당신이 살아온 시간을 숫자로 표현했어요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((card, index) => (
            <StatCard
              key={card.label}
              icon={card.icon}
              label={card.label}
              value={card.value}
              unit={card.unit}
              delay={index * 100}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={onDownloadImage}>
            📥 이미지로 저장
          </Button>
          <Button onClick={onShareUrl} variant="secondary">
            🔗 URL 복사
          </Button>
          <Button onClick={onReset} variant="secondary">
            🔄 다시 계산하기
          </Button>
        </div>
      </div>
    </div>
  );
}

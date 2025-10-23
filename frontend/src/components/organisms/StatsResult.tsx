/**
 * StatsResult Organism Component
 * Displays anniversary statistics and milestone countdowns in a responsive grid
 * Dynamically generates milestone cards based on configuration
 *
 * @module components/organisms/StatsResult
 */
'use client';

import StatCard from '../atoms/StatCard';
import Button from '../atoms/Button';
import { LifeStats } from '@/types';
import { useDictionary } from '@/contexts/DictionaryContext';
import { ANNIVERSARY_MILESTONES } from '@/constants';

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
  const dict = useDictionary();

  /**
   * Calculates days remaining until a milestone
   * @param targetDays - Target milestone in days
   * @returns Days remaining, or null if milestone has passed
   */
  const calculateDaysRemaining = (targetDays: number): number | null => {
    const remaining = targetDays - stats.total_days;
    return remaining > 0 ? remaining : null;
  };

  // Base statistics cards (always shown)
  const baseStatCards = [
    {
      icon: '📅',
      label: dict.stats.daysLived,
      value: stats.total_days,
      unit: '일',
    },
    {
      icon: '⏰',
      label: dict.stats.hoursLived,
      value: stats.total_hours,
      unit: '시간',
    },
    {
      icon: '⏱️',
      label: dict.stats.minutesLived,
      value: stats.total_minutes,
      unit: '분',
    },
    {
      icon: '⚡',
      label: dict.stats.secondsLived,
      value: stats.total_seconds,
      unit: '초',
    },
    {
      icon: '💓',
      label: dict.stats.heartbeats,
      value: stats.heartbeats,
      unit: '회',
    },
    {
      icon: '🌬️',
      label: dict.stats.breaths,
      value: stats.breaths,
      unit: '회',
    },
    {
      icon: '😴',
      label: dict.stats.sleepHours,
      value: stats.sleep_hours,
      unit: '시간',
    },
    {
      icon: '🍚',
      label: dict.stats.mealsEaten,
      value: stats.meals_eaten,
      unit: '끼',
    },
    {
      icon: '🎉',
      label: dict.stats.daysUntilBirthday,
      value: stats.days_until_next_birthday,
      unit: '일',
    },
  ];

  // Generate milestone cards from configuration
  const milestoneCards = ANNIVERSARY_MILESTONES.map((milestone) => {
    const daysRemaining = calculateDaysRemaining(milestone.days);
    return daysRemaining !== null
      ? {
          icon: milestone.icon,
          label: dict.stats[milestone.labelKey as keyof typeof dict.stats] as string,
          value: daysRemaining,
          unit: '일',
        }
      : null;
  }).filter((card): card is NonNullable<typeof card> => card !== null);

  // Always show next 10,000-day milestone
  const nextMilestoneCard = {
    icon: '🎯',
    label: `${stats.next_milestone.toLocaleString()}${dict.stats.nextMilestone}`,
    value: stats.days_until_next_milestone,
    unit: '일',
  };

  // Combine all stat cards
  const statCards = [...baseStatCards, ...milestoneCards, nextMilestoneCard];

  return (
    <div id="stats-result" className="w-full max-w-6xl">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {dict.stats.title}
          </h1>
          <p className="text-gray-600">지금까지 함께한 시간을 숫자로 표현했어요 💕</p>
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
            {dict.stats.downloadButton}
          </Button>
          <Button onClick={onShareUrl} variant="secondary">
            {dict.stats.shareButton}
          </Button>
          <Button onClick={onReset} variant="secondary">
            {dict.stats.resetButton}
          </Button>
        </div>
      </div>
    </div>
  );
}

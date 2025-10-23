/**
 * StatCard Atom Component
 * Displays a single statistic with animated count-up effect
 * Uses centralized animation constants for consistency
 *
 * @module components/atoms/StatCard
 */
'use client';

import { useEffect, useState } from 'react';
import { STAT_ANIMATION_DURATION, STAT_ANIMATION_STEPS } from '@/constants';

interface StatCardProps {
  /** Icon emoji to display */
  icon: string;
  /** Label describing the statistic */
  label: string;
  /** Numeric value to display */
  value: number;
  /** Unit of measurement */
  unit: string;
  /** Delay before starting animation (milliseconds) */
  delay?: number;
}

/**
 * Animated statistic card component
 * Counts up from 0 to the target value with staggered animation
 *
 * @param props - Component props
 * @returns Rendered stat card with animation
 */
export default function StatCard({ icon, label, value, unit, delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Start animation after configured delay
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      setIsAnimating(true);
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [delay]);

  // Animate count-up effect
  useEffect(() => {
    if (!isAnimating) return;

    const increment = value / STAT_ANIMATION_STEPS;
    const stepDuration = STAT_ANIMATION_DURATION / STAT_ANIMATION_STEPS;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, isAnimating]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      <div className="flex items-center mb-3">
        <span className="text-3xl mr-3">{icon}</span>
        <h3 className="text-gray-700 font-semibold">{label}</h3>
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {displayValue.toLocaleString()}
        </p>
        <p className="text-gray-500 text-sm mt-1">{unit}</p>
      </div>
    </div>
  );
}

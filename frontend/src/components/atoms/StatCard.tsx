/**
 * StatCard Atom Component
 * Display a single statistic with icon and label
 */
'use client';

import { useEffect, useState } from 'react';

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  unit: string;
  delay?: number;
}

export default function StatCard({ icon, label, value, unit, delay = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation after delay
    const delayTimer = setTimeout(() => {
      setIsAnimating(true);
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [delay]);

  useEffect(() => {
    if (!isAnimating) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

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

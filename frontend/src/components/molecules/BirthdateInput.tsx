/**
 * BirthdateInput Molecule Component
 * Combines year, month, day number inputs for special date entry
 */
'use client';

import NumberInput from '../atoms/NumberInput';
import { MIN_BIRTH_YEAR } from '@/constants';
import { useDictionary } from '@/contexts/DictionaryContext';

interface BirthdateInputProps {
  year: number;
  month: number;
  day: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onDayChange: (day: number) => void;
}

export default function BirthdateInput({
  year,
  month,
  day,
  onYearChange,
  onMonthChange,
  onDayChange,
}: BirthdateInputProps) {
  const dict = useDictionary();
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{dict.form.title}</h2>
        <p className="text-gray-600">{dict.hero.subtitle}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <NumberInput
          value={year}
          onChange={onYearChange}
          placeholder="YYYY"
          min={MIN_BIRTH_YEAR}
          max={currentYear}
          label={dict.form.year}
        />
        <NumberInput
          value={month}
          onChange={onMonthChange}
          placeholder="MM"
          min={1}
          max={12}
          label={dict.form.month}
        />
        <NumberInput
          value={day}
          onChange={onDayChange}
          placeholder="DD"
          min={1}
          max={31}
          label={dict.form.day}
        />
      </div>

      <div className="text-center text-xs text-gray-500 mt-2">
        {dict.form.year === '년' ? '예시: 2024년 1월 1일' : 'Example: January 1, 2024'}
      </div>
    </div>
  );
}

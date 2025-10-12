/**
 * BirthdateInput Molecule Component
 * Combines year, month, day number inputs
 */
'use client';

import NumberInput from '../atoms/NumberInput';
import { MIN_BIRTH_YEAR } from '@/constants';

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
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">생년월일을 입력하세요</h2>
        <p className="text-gray-600">당신의 인생을 숫자로 확인해보세요</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <NumberInput
          value={year}
          onChange={onYearChange}
          placeholder="YYYY"
          min={MIN_BIRTH_YEAR}
          max={currentYear}
          label="년"
        />
        <NumberInput
          value={month}
          onChange={onMonthChange}
          placeholder="MM"
          min={1}
          max={12}
          label="월"
        />
        <NumberInput
          value={day}
          onChange={onDayChange}
          placeholder="DD"
          min={1}
          max={31}
          label="일"
        />
      </div>

      <div className="text-center text-xs text-gray-500 mt-2">
        예시: 1990년 5월 15일
      </div>
    </div>
  );
}

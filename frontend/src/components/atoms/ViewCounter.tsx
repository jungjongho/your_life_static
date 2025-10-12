/**
 * ViewCounter Atom Component
 * Display view count statistics
 */
'use client';

interface ViewCounterProps {
  label: string;
  count: number;
  icon?: string;
}

export default function ViewCounter({ label, count, icon = '👀' }: ViewCounterProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span>{icon}</span>
      <span className="font-medium">{label}:</span>
      <span className="font-bold text-purple-600">{count.toLocaleString()}</span>
    </div>
  );
}

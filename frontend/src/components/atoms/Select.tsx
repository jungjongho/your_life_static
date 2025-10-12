/**
 * Select Atom Component
 * Reusable select dropdown
 */
interface SelectProps {
  value: number;
  onChange: (value: number) => void;
  options: { value: number; label: string }[];
  placeholder?: string;
}

export default function Select({ value, onChange, options, placeholder }: SelectProps) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

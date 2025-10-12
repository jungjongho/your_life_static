/**
 * NumberInput Atom Component
 * Reusable number input field
 */
interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  label?: string;
}

export default function NumberInput({
  value,
  onChange,
  placeholder,
  min,
  max,
  label
}: NumberInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type="number"
        value={value || ''}
        onChange={(e) => {
          const val = e.target.value === '' ? 0 : parseInt(e.target.value, 10);
          onChange(val);
        }}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none text-lg text-center"
      />
    </div>
  );
}

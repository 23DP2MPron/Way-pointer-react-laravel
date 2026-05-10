import { useState } from 'react';

export default function StarRating({ value = 0, onChange, readonly = false }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(n)}
          onMouseEnter={() => !readonly && setHover(n)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`text-2xl transition-transform ${!readonly ? 'cursor-pointer hover:scale-110' : 'cursor-default'} ${n <= display ? 'text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
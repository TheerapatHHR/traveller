'use client';

import { useState, useEffect, useRef } from 'react';

const inputClass =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 disabled:pointer-events-none disabled:opacity-50';

interface Option {
  value: string;
  label: string;
}

interface LocationSelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  disabled?: boolean;
}

export function LocationSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: LocationSelectProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

  // Reset query when parent clears the value (e.g. start changes → dest resets)
  useEffect(() => {
    if (!value) setQuery('');
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  function handleSelect(opt: Option) {
    onChange(opt.value);
    setQuery('');
    setOpen(false);
  }

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={open ? query : selectedLabel}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          autoComplete="off"
          className={inputClass}
        />
        {open && filtered.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-border bg-background shadow-md">
            {filtered.map((opt) => (
              <li
                key={opt.value}
                onMouseDown={() => handleSelect(opt)}
                className="cursor-pointer px-3 py-2 text-sm hover:bg-muted"
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
        {open && filtered.length === 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground shadow-md">
            No results
          </div>
        )}
      </div>
    </div>
  );
}

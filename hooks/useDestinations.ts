'use client';

import { useState, useEffect } from 'react';

export type Destination = { name: string; distance: string };

export function useDestinations(selectedIndex: string) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedIndex) {
      setDestinations([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setDestinations([]);

    fetch(`/data/grouped/${selectedIndex}.csv`)
      .then((res) => res.text())
      .then((text) => {
        if (cancelled) return;
        const seen = new Map<string, string>();
        text
          .split('\n')
          .slice(1)
          .filter(Boolean)
          .forEach((line) => {
            const parts = line.trimEnd().split(',');
            if (parts.length < 3) return;
            if (!seen.has(parts[1])) seen.set(parts[1], parts[2]);
          });
        setDestinations(
          Array.from(seen.entries()).map(([name, distance]) => ({ name, distance }))
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedIndex]);

  return { destinations, loading };
}

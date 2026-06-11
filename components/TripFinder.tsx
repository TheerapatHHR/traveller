'use client';

import { useState } from 'react';
import type { MapEntry } from '@/app/page';
import { useDestinations } from '@/hooks/useDestinations';
import { LocationSelect } from '@/components/LocationSelect';
import { DistanceResult } from '@/components/DistanceResult';

interface TripFinderProps {
  mapEntries: MapEntry[];
}

export function TripFinder({ mapEntries }: TripFinderProps) {
  const [selectedIndex, setSelectedIndex] = useState('');
  const [selectedDest, setSelectedDest] = useState('');
  const { destinations, loading } = useDestinations(selectedIndex);

  const distance = selectedDest
    ? destinations.find((d) => d.name === selectedDest)?.distance
    : undefined;

  const startOptions = mapEntries.map((e) => ({ value: e.index, label: e.name }));
  const destOptions = destinations.map((d) => ({ value: d.name, label: d.name }));

  function handleStartChange(value: string) {
    setSelectedIndex(value);
    setSelectedDest('');
  }

  const destPlaceholder = loading
    ? 'Loading…'
    : !selectedIndex
      ? 'Select a starting point first'
      : 'Select a destination…';

  return (
    <div className="w-full max-w-md space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Trip Distance</h1>

      <div className="space-y-4">
        <LocationSelect
          id="start-select"
          label="Starting point"
          value={selectedIndex}
          onChange={handleStartChange}
          options={startOptions}
          placeholder="Select a starting point…"
        />
        <LocationSelect
          id="dest-select"
          label="Destination"
          value={selectedDest}
          onChange={setSelectedDest}
          options={destOptions}
          placeholder={destPlaceholder}
          disabled={!selectedIndex || loading}
        />
      </div>

      {distance !== undefined && <DistanceResult distance={distance} />}
    </div>
  );
}

import fs from 'node:fs';
import path from 'node:path';
import { TripFinder } from '@/components/TripFinder';

export type MapEntry = { index: string; name: string };

export default function Home() {
  const raw = fs.readFileSync(
    path.join(process.cwd(), 'public', 'data', 'grouped', 'map.csv'),
    'utf-8'
  );

  const mapEntries: MapEntry[] = raw
    .split('\n')
    .slice(1)
    .filter(Boolean)
    .map((line) => {
      const trimmed = line.trimEnd();
      const i = trimmed.indexOf(',');
      return { index: trimmed.slice(0, i), name: trimmed.slice(i + 1) };
    });

  return (
    <main className="flex min-h-full flex-col items-center justify-center p-8">
      <TripFinder mapEntries={mapEntries} />
    </main>
  );
}

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputDir = join(__dirname, '..', 'public', 'data', 'cleaned');
const outputDir = join(__dirname, '..', 'public', 'data', 'grouped');

mkdirSync(outputDir, { recursive: true });

const corrections = JSON.parse(readFileSync(join(__dirname, 'name-corrections.json'), 'utf-8'));
const normalize = (s) => corrections[s] ?? s;

const groups = new Map();

for (const file of readdirSync(inputDir).filter(f => f.endsWith('.csv'))) {
  const lines = readFileSync(join(inputDir, file), 'utf-8').split(/\r?\n/);
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const firstComma = line.indexOf(',');
    const rawStart = line.slice(0, firstComma);
    const rest = line.slice(firstComma);
    const start = normalize(rawStart);
    const normalizedLine = start + rest;
    if (!groups.has(start)) groups.set(start, []);
    groups.get(start).push(normalizedLine);
  }
}

const sorted = [...groups.keys()].sort((a, b) => a.localeCompare(b, 'th'));

const mapRows = ['index,start'];
for (let i = 0; i < sorted.length; i++) {
  const start = sorted[i];
  mapRows.push(`${i},${start}`);

  const rows = ['start,destination,distance', ...groups.get(start)];
  writeFileSync(join(outputDir, `${i}.csv`), rows.join('\n'), 'utf-8');
}

writeFileSync(join(outputDir, 'map.csv'), mapRows.join('\n'), 'utf-8');

console.log(`Done. ${sorted.length} starting points → public/data/grouped/`);
console.log(`map.csv written with ${sorted.length} entries.`);

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputDir = join(__dirname, '..', 'public', 'data', 'raw');
const outputDir = join(__dirname, '..', 'public', 'data', 'cleaned');

mkdirSync(outputDir, { recursive: true });

function parseCSVRow(line) {
  const cols = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      cols.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  cols.push(current);
  return cols;
}

const files = readdirSync(inputDir).filter(f => f.endsWith('.csv'));

for (const file of files) {
  const raw = readFileSync(join(inputDir, file), 'utf-8');
  const rows = raw.split(/\r?\n/);

  const output = ['start,destination,distance'];

  for (let i = 2; i < rows.length; i++) {
    const cols = parseCSVRow(rows[i]);
    if (cols.every(c => c.trim() === '')) continue;

    const start = cols[4]?.trim() ?? '';
    const destination = cols[5]?.trim() ?? '';
    const distance = cols[10]?.trim() ?? '';

    const distNum = Number(distance);
    if (!distance || isNaN(distNum) || distNum <= 0) continue;

    output.push(`${start},${destination},${distance}`);
  }

  const outFile = file.replace('(Sheet1)', '');
  writeFileSync(join(outputDir, outFile), output.join('\n'), 'utf-8');
  console.log(`✓ ${outFile} → ${output.length - 1} trip rows`);
}

console.log(`\nDone. Cleaned files in public/data/cleaned/`);

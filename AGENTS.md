<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Trip Data CSV Files

Raw fleet-card expense reports live in `public/data/*.csv`. Each file covers one month of trips.

**Column layout (1-indexed):**
- Col 5: starting point
- Col 6: destination
- Col 11: distance in km

**File quirks:**
- Row 1: print/metadata header — skip
- Row 2: aggregate summary row — skip
- Even-numbered rows are empty separators — skip
- Filenames export with a `(Sheet1)` suffix that should be stripped
- Some rows contain quoted fuel-cost values with commas inside (e.g. `"1,100.00 "`). **Never use `.split(',')` to parse these files** — use a proper RFC-4180 CSV parser (see `parseCSVRow` in `scripts/clean-csv.mjs`). Naive splitting shifts all columns after the quoted field, causing wrong values to land in the distance column (e.g. `FLEET` instead of `5`)
- End-of-file summary and footer rows can bleed through if only filtering for `distance === 0`. Filter with `isNaN(Number(distance)) || Number(distance) <= 0` to catch non-numeric values too

**Cleaned files** are written to `public/data/cleaned/` using `scripts/clean-csv.mjs`. The script automatically strips `(Sheet1)` from output filenames. To regenerate:
```
node scripts/clean-csv.mjs
```

## Grouped files by starting point

`public/data/grouped/` contains one file per unique starting point, generated from the cleaned files by `scripts/group-by-start.mjs`. To regenerate:
```
node scripts/group-by-start.mjs
```

- **`map.csv`** — maps numeric index to starting point name (`index,start`); ~86 entries, sorted alphabetically by Thai locale
- **`0.csv` … `N.csv`** — each file holds all trips for one starting point, columns: `start,destination,distance`
- The cleaned files use plain comma separation (no quoted commas), so simple `.split(',')` is safe when reading `public/data/cleaned/` — the proper `parseCSVRow` parser is only needed for the raw files in `public/data/`
- Run `clean-csv.mjs` first, then `group-by-start.mjs` if both need regenerating

## Name normalization

The raw data has many spelling variants for the same place (case differences, Thai abbreviations, typos). `scripts/name-corrections.json` maps every known variant to its canonical name. `group-by-start.mjs` applies this map before grouping, so all variants land in the same file.

**Common variant patterns to watch for:**
- Case: `siph` / `SiPH` / `SIPH` → `SIPH`
- Thai prefix variants: `รพ.`, `รพ. `, `โรงพยาบาล` all mean the same thing — canonical form uses full `โรงพยาบาล` prefix
- Spacing: `วิชัยเวช สมุทรสาคร` vs `วิชัยเวชสมุทรสาคร`
- Typos with doubled Thai vowel marks: `ธนบุุรี`, `ปั๊ั๊ม`, `บ้้าน`, `สุุขุมวิท`
- Different branch numbers (e.g. บางปะกอก **1**, **3**, **8**) are kept as separate groups — only same-branch spelling variants are merged

**To add new corrections** — edit `scripts/name-corrections.json`:
```json
{ "variant spelling": "canonical name" }
```
Then run `/refresh-trip-data` (or `node scripts/group-by-start.mjs`) to regenerate. No new skill needed — corrections feed directly into the existing pipeline.

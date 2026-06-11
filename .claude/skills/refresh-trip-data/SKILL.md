---
description: Regenerate all trip data files from the raw CSVs in public/data/raw/. Run this whenever new monthly CSV files are added.
---

Regenerate all trip data files from the raw CSVs in `public/data/raw/`.

Run these two scripts in sequence:

```
node scripts/clean-csv.mjs
node scripts/group-by-start.mjs
```

`clean-csv.mjs` reads `public/data/raw/*.csv`, strips metadata rows, removes zero/invalid-distance rows, keeps only start/destination/distance columns, and writes cleaned files to `public/data/cleaned/`.

`group-by-start.mjs` reads `public/data/cleaned/*.csv`, applies name normalization from `scripts/name-corrections.json`, groups all rows by starting point, writes one file per unique start to `public/data/grouped/<index>.csv`, and writes the index map to `public/data/grouped/map.csv`.

After running, report how many rows each cleaned file produced and how many grouped files were created.

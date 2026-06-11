## Trip Data

Raw fleet-card CSV reports live in `public/data/`. Running the data pipeline produces two derived datasets:

| Folder | Contents |
|---|---|
| `public/data/cleaned/` | One CSV per month — columns: `start, destination, distance` |
| `public/data/grouped/` | One CSV per unique starting point + `map.csv` index |

### When new monthly data arrives

Follow these steps each time a new CSV export is added:

**1. Drop the file into `public/data/`**
The filename will look like `Sep25(Sheet1).csv`. Leave it as-is — the pipeline strips the `(Sheet1)` suffix automatically.

**2. Run the pipeline**
Type this in the Claude Code chat window:
```
/refresh-trip-data
```
This cleans the raw files and rebuilds the grouped output in one step.

**3. Check for new name variants**
Open `public/data/grouped/map.csv` and scan for entries that look like duplicates of existing places — different spelling, abbreviation style, or case. Common patterns:
- `รพ.ชื่อ` / `รพ. ชื่อ` / `โรงพยาบาลชื่อ` — all mean the same hospital
- Mixed case: `siph` / `SiPH` / `SIPH`
- Typos with doubled Thai vowel marks: `ธนบุุรี`, `บ้้าน`
- Thai vs English name for the same place

**4. Add corrections if needed**
Edit `scripts/name-corrections.json` and add any new variants:
```json
{ "new variant spelling": "existing canonical name" }
```
Then re-run `/refresh-trip-data` to apply.

---

### How the pipeline works

```bash
node scripts/clean-csv.mjs       # strips metadata rows, keeps start/destination/distance
node scripts/group-by-start.mjs  # normalizes names, groups by starting point
```

Name normalization is driven by `scripts/name-corrections.json` — a flat lookup of `variant → canonical`. Anything not listed passes through unchanged.

> **Note:** `/refresh-trip-data` is a Claude Code skill — type it in the Claude Code chat window, not the system terminal.
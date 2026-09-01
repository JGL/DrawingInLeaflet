# Prompt history

A running log of the prompts given to Claude Code and the changes that resulted, so future sessions have continuity. Convention: append a dated entry per working session — what was asked, what was changed, and any decisions or caveats worth remembering.

## Backfilled from git history (pre-dating this log)

- **Holland Park debug tour** (`aa07125`, `f0387e5`) — Added a debug Leaflet tour of Holland Park (v10/v11) and pointed the root index at the latest debug page.
- **Position marker fix** (`1f6e348`) — Stopped the live-position marker from dragging the map view to it on every GPS update.
- **v10 GPS fix; v12 and v13 added** (`30b699b`) — Fixed frozen GPS in v10. Added v12 (`12_hollandParkTourCentreRadius`): a client using centre+radius geofencing with GPS-accuracy-aware enter/exit radii and hysteresis. Added v13: combined tour editor and client.
- **v14: GitHub write-back** (`b11aded`) — Tour editor that persists `tour.geojson` back to the repo via the GitHub API (no backend, works on iOS Safari).

## 2026-08-04 — v15: Hampstead Heath tour

**Prompt:** Make a new version of `docs/12_hollandParkTourCentreRadius` in `docs/15_12_hampsteadHeathTourCentreRadius`, using new data (12 images + an Excel spreadsheet of tour information). Also start this prompt-history file.

**Changes:**

- Scaffolded `docs/15_12_hampsteadHeathTourCentreRadius/` as a copy of v12; removed the Holland Park images; added a `sourceData/` folder holding the source-of-truth spreadsheet (`Hampstead Heath Tour.xlsx`, not used at runtime). Tour images live in `img/` as `1.jpg`–`12.jpg`, matching the spreadsheet's "Image number" column.
- Generated `data/tour.geojson` from the spreadsheet: 12 Point features with `name`, `multimedia` (`img/<n>.jpg`), `radius: 25` (the sheet has no radius column, so v12's standard 25 m was used throughout — tune per stop as needed), and a new `description` property combining the sheet's "Information 1" and "Information 2" columns. The sheet's degrees-minutes-seconds coordinates were converted to decimal degrees.
- Adapted `index.html`: new title, `PARK_CENTRE` `[51.564, -0.1772]` at zoom 15, and the media card now shows the stop's `description` text (scrollable) beneath the image — a v15 addition over v12's name+image-only card.
- Added v15 to the experiment list in `docs/index.html`.

**Caveats / open questions:**

- Many of the spreadsheet coordinates did not match the real landmarks. Plotting them on the map shows e.g. Kenwood House and the Sham Bridge near Golders Hill Park, Hill Garden &amp; Pergola west of Finchley Road (off the Heath entirely), Vale of Health in the streets south-west of the Heath, and Whitestone Pond in the middle of the east Heath. Parliament Hill Viewpoint and the Spaniard's Inn look roughly right. The offsets are not uniform, so it looks like transcription error rather than a datum/conversion issue. Coordinates were plotted exactly as given in the sheet. **Decision (2026-08-04): keep them as-is — they are the ones the researcher inputted.** If they ever need correcting: fix the sheet and regenerate the geojson, or drag/edit the stops in the v13/v14 editor.

## 2026-08-18 — v15 tester feedback: corrected coordinates, fix-age readout, README tour guide

**Prompt:** Tester feedback on the live v15 tour: (1) image/text display works well in the field; (2) GPS accuracy is good (down to 3 m) — asked if the location refresh rate could be increased; (3) the researcher's waypoint coordinates were indeed incorrect — the tester supplied corrected ones for seven stops; (4) asked for README instructions so others can make their own tours by cloning the repo.

**Changes:**

- Updated `docs/15_12_hampsteadHeathTourCentreRadius/data/tour.geojson` with the tester's corrected coordinates for Kenwood House, The Sham Bridge, Hill Garden & Pergola, Vale of Health, Whitestone Pond, Highgate Ponds and the Mixed Bathing Pond (the geojson is now the source of truth; the spreadsheet in `sourceData/` retains the researcher's original, incorrect values). Re-centred `PARK_CENTRE` to `[51.564, -0.1699]` for the corrected spread.
- Refresh rate: the page already requests the fastest updates the Geolocation API allows (`watch: true`, `maximumAge: 0`, `enableHighAccuracy: true`); the delivery rate (~1/second) is set by the phone's OS and cannot be increased from JavaScript. Added a "Last fix: X.X s ago" readout to the status panel (updated 4×/second) so the actual GPS cadence is visible in the field.
- Added a "Make your own walking tour" section to `README.md`: clone/fork, copy the v15 folder, add images, edit `tour.geojson` (documented the feature format, `[lng, lat]` ordering, radius behaviour), set `PARK_CENTRE`, publish via GitHub Pages `/docs`, plus local-testing and HTTPS notes and pointers to the v13/v14 editors.

## 2026-09-01 — v16: Cartuja (Granada) tour with cycling images and texts

**Prompt:** New tour from collaborator Aleks Pluskowski (University of Reading): the Spanish spreadsheet for Cartuja, Granada (`Tour of Cartuja.xlsx` + images in `2026_09_01_spanishDataAndContent/`, some webp needing conversion). Each stop has 2–3 pieces of information — asked for a way to cycle through them (Hampstead only ever showed one). A map of the original polygons was supplied to size the new circles; spreadsheet coordinates are points.

**Changes:**

- Scaffolded `docs/16_cartujaTourCentreRadius/` from v15. `sourceData/` holds the spreadsheet and Aleks's polygon map. Images converted to jpg with `sips` (webp/png sources; anything over 1600 px downscaled — 8.jpg was 10 MB/5464 px, now 528 KB), named `1.jpg`–`9.jpg` with letter suffixes where a stop has several (`4a`–`4d`, `7a`–`7b`).
- **New geojson schema (v16):** `multimedia`/`description` replaced by arrays `images` and `descriptions`, plus `imagesNote` (the sheet's "Images" column, used as alt text). The v13/v14 editors don't know this schema.
- **Client additions over v15:** the media card cycles — image pager (‹ › overlay buttons, tap photo to advance, "n/m" badge) and independent text pager ("n of m"); controls only render when there's more than one. Indices reset when the shown stop changes. Nearest-active-zone display unchanged from v15 and now matters: stops 6–9 are within ~40 m of each other (8 and 9 only ~9 m apart).
- DMS coordinates from the sheet converted to decimal. Radii estimated from the polygon map (map scale calibrated against inter-stop distances): 30 m (1), 55 m (2, monastery precinct), 15 m (3, 4), 60 m (5, Colegio Máximo), 12 m (6), 10 m (7–9, the tight palace cluster).
- Added v16 to `docs/index.html`; README notes the array-based format for multi-image/text tours.
- Verified in the browser by simulating `locationfound` events: cycling + wrap-around, nearest-wins in the 8/9 overlap, no nav buttons on single-media stops, card hides on exit.

**Caveats / open questions:**

- Radii for stops 6–9 are deliberately small, but GPS slop (`ACCURACY_CAP` 30 m) still makes them overlap in practice; the nearest stop wins, so walking the cluster should feel right, but worth a field test.
- Stop 1's title in the sheet is "Entry to Aynadamar / Cartuja"; stop 4's sheet title had quotation marks ("Morisco rubbish pit") which were stripped.
- Coordinates plotted exactly as given — they all look plausible on the Cartuja campus (unlike the original Hampstead sheet), but a field test will confirm.

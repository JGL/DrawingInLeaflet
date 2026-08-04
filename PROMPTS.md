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

- Many of the spreadsheet coordinates do not match the real landmarks. Plotting them on the map shows e.g. Kenwood House and the Sham Bridge near Golders Hill Park, Hill Garden &amp; Pergola west of Finchley Road (off the Heath entirely), Vale of Health in the streets south-west of the Heath, and Whitestone Pond in the middle of the east Heath. Parliament Hill Viewpoint and the Spaniard's Inn look roughly right. The offsets are not uniform, so it looks like transcription error rather than a datum/conversion issue. Coordinates were plotted exactly as given in the sheet. **Decision (2026-08-04): keep them as-is — they are the ones the researcher inputted.** If they ever need correcting: fix the sheet and regenerate the geojson, or drag/edit the stops in the v13/v14 editor.

# DrawingInLeaflet
A series of experiments in drawing with the Leaflet map library

Please access <https://jgl.github.io/DrawingInLeaflet/> to play with the demos.

## Make your own walking tour

The most complete example is the [Hampstead Heath tour](https://jgl.github.io/DrawingInLeaflet/15_12_hampsteadHeathTourCentreRadius/) (`docs/15_12_hampsteadHeathTourCentreRadius/`): a self-contained web page that follows you via GPS and automatically shows a photo and text when you walk into the radius of a tour stop. To make one of your own:

1. **Clone (or fork) this repository.**

2. **Copy the example folder** to a new folder under `docs/`, e.g.:

   ```
   cp -R docs/15_12_hampsteadHeathTourCentreRadius docs/16_myTown
   ```

3. **Add your images** to `docs/16_myTown/img/`, one per stop (delete the Hampstead ones).

4. **Describe your stops** in `docs/16_myTown/data/tour.geojson`. Each stop is a GeoJSON `Point` feature:

   ```json
   {
     "type": "Feature",
     "properties": {
       "name": "Name shown as the stop's title",
       "multimedia": "img/myPhoto.jpg",
       "radius": 25,
       "description": "Text shown under the photo when you arrive."
     },
     "geometry": {
       "type": "Point",
       "coordinates": [-0.1594444, 51.5569444]
     }
   }
   ```

   Notes:
   - Coordinates are `[longitude, latitude]` in decimal degrees (west of Greenwich is negative). Right-clicking a spot in Google Maps, or using [geojson.io](https://geojson.io/), is an easy way to get them.
   - `radius` is in metres — the media card appears when the visitor is within roughly this distance of the stop (expanded a little by GPS inaccuracy, with hysteresis so it doesn't flicker at the boundary).

5. **Point the map at your area**: in `docs/16_myTown/index.html`, edit the `<title>`, and set `PARK_CENTRE` (and the zoom level in `setView`) to frame your tour before the first GPS fix arrives.

6. **Optionally add your tour to the demo list** in `docs/index.html`.

7. **Publish with GitHub Pages**: in your repository's settings, enable Pages serving from the `main` branch, `/docs` folder. Your tour will appear at `https://<your-username>.github.io/<your-repo>/16_myTown/`.

   Geolocation only works on secure (HTTPS) pages, which GitHub Pages provides — opening the files straight from disk won't work. For local testing, run a simple server (`python3 -m http.server 8123 --directory docs`) and open `http://localhost:8123/16_myTown/` — browsers treat `localhost` as secure.

If you'd rather draw your stops on a map than type coordinates, experiment [13](https://jgl.github.io/DrawingInLeaflet/13_tourEditorAndClient/) is a visual editor that exports `tour.geojson` files, and experiment [14](https://jgl.github.io/DrawingInLeaflet/14_tourEditorGitHubWriteback/) can even save them straight back to a GitHub repository.

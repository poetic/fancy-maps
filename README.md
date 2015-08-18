# fancy-maps
React components for creating Leaflet maps

Usage
-----
Use `gulp` to start the live reload server, which opens a browser with the basic demo. See `gulpfile.js` for more gulp tasks.

Components
----------

#### `LeafletMap`
Instantiates a new Leaflet map.

Example: `<LeafletMap lat="29.817178" lon="-95.4012915" minZoom="2" maxZoom="20" zoom="10" />`

#### `LayerGroup`
Adds a new LayerGroup to a Leaflet map.

Example: `<LayerGroup showThreshold="11" hideThreshold="12" dataSource="communities.geojson" />`

Note: Must be a child of `<LeafletMap>`

Resources
---------

Further reading:
  - http://facebook.github.io/react/
  - http://leafletjs.com/

For example usage, see examples/basic-map.html (running `gulp` will automatically open this file in a browser).

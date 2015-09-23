# fancy-maps
React components for creating Leaflet maps. [DEMO](http://poetic.github.io/fancy-maps/).

Quick Start
-----------
To use the Fancy Maps components in your project:
  - Include `dist/leaflet-components.js`
  - Include `dist/vendor.css`
  - Start using Fancy Maps components (see the demo) or full example below

You can obtain these files by running the default Gulp task (`gulp` command with no arguments) and then looking in `dist/`.

Note that you will need to include the in-browser [JSXTransformer](https://facebook.github.io/react/docs/tooling-integration.html#in-browser-jsx-transform) while developing your maps and then [precompile](https://facebook.github.io/react/docs/tooling-integration.html#productionizing-precompiled-jsx) the JSX when you're ready for production, if you choose to use JSX. 

Development
-----
  - Install dependencies with `npm install`
  - Start the live reload server using `gulp`
  - Point your browser to [http://localhost:8000](http://localhost:8000)

See `gulpfile.js` for more gulp tasks.

Components
----------
#### `LeafletMap`
Instantiates a new Leaflet map.

Example: `<LeafletMap lat="29.817178" lon="-95.4012915" minZoom="2" maxZoom="20" zoom="10" />`

#### `LeafletLayer`
Adds a new layer containing polygons to a Leaflet map.

Example: `<LeafletLayer showThreshold="11" hideThreshold="12" dataSource="communities.geojson" />`

Note: Must be a child of `<LeafletMap>`

#### `LeafletLegend`
Adds a legend control to a Leaflet map.

Example: ``<LeafletLegend>{`<h3>Key</h3>`}</LeafletLegend>``

Note: Must be a child of `<LeafletMap>`

Full Example
------------
```javascript
<LeafletMap lat="29.817178" lon="-95.4012915" minZoom="10" maxZoom="17" zoom="10">
  <LeafletLayer showThreshold="10" hideThreshold="12" dataSource="communities.geojson">
    {"My address is {{address}}."}
  </LeafletLayer>
  <LeafletLegend>
    {`
      <h2>Legend</h2>
      <div class="body">
        <div class="water">Water</div><br />
        <div class="polygon">Polygon</div><br />
      </div>
    `}
  </LeafletLegend>
  <LeafletLayer showThreshold="13" hideThreshold="14" dataSource="sections.geojson" />
  <LeafletLayer showThreshold="10" hideThreshold="17"
                dataSource="https://dl.dropboxusercontent.com/u/46535302/Section%2012.geojson"
                cluster="true" className="real-section">
    {`
      <h2>{{Address}}</h2>
      <ul>
        <li>Lot: {{Lot}}</li>
        <li>Block: {{Block}}</li>
        <li>Section: {{Section}}</li>
      </ul>
    `}
  </LeafletLayer>
</LeafletMap>
```

Resources
---------
Further reading:
  - http://facebook.github.io/react/
  - http://leafletjs.com/

For example usage, see examples/basic-map.html.

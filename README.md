# fancy-maps
React components for creating Leaflet maps. [DEMO](http://poetic.github.io/fancy-maps/).

Quick Start
-----------
To use the Fancy Maps components in your project:
  - Include [`dist/fancy-maps.min.js`](https://rawgit.com/poetic/fancy-maps/master/dist/fancy-maps.min.js)
  - Include [`dist/fancy-maps.min.css`](https://rawgit.com/poetic/fancy-maps/master/dist/fancy-maps.min.css)
  - Include the [JSXTransformer](https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/JSXTransformer.js)
  - Start using Fancy Maps components (see the demo) or full example below

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

#### `Tiles`
You can set the background tiles you perfer. Some good ones to choose from are here: https://leaflet-extras.github.io/leaflet-providers/preview/

The default tile is ``http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png``

Full Example
------------
Full working example is located at examples/basic-map.html
```javascript
<link rel="stylesheet" href="../dist/fancy-maps.css" />
<link rel="stylesheet" href="styles.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/JSXTransformer.js"></script>
<script type="text/jsx" src="../dist/fancy-maps.js"></script>

<script type="text/jsx">
  React.render(
  <LeafletMap lat="29.817178"
              lon="-95.4012915"
              minZoom="10"
              maxZoom="17"
              zoom="10"
              maxBounds={[[29.9150, -95.7314], [29.9533, -95.6901]]}
              tileProvider='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'>

    <LeafletLegend>
      {`
        <h2>Legend</h2>
        <div class="body">
        <div class="water">Water</div><br />
        <div class="polygon">Polygon</div><br />
        </div>
      `}
    </LeafletLegend>

    <LeafletLayer showThreshold="10" hideThreshold="12" dataSource="communities.geojson">
      {"Community address is {{address}}."}
    </LeafletLayer>

    <LeafletLayer showThreshold="13" hideThreshold="14" dataSource="sections.geojson" />

    <LeafletLayer showThreshold="10" hideThreshold="17" disableClusteringAtZoom="16"
                  dataSource="https://dl.dropboxusercontent.com/u/46535302/Section%2012.geojson"
                  cluster="true" className="real-section"
                  featureClassPrefix="block" featureClassName="Block">
      {`
        <h2>{{Address}}</h2>

        {{#if-eq Lot 20}}
          <h4>Lot is 20</h4>
        {{else}}
          <h4>Lot is not 20</h4>
        {{/if-eq}}

        <ul>
          <li>Lot: {{Lot}}</li>
          <li>Block: {{Block}}</li>
          <li>Section: {{Section}}</li>
        </ul>
      `}
    </LeafletLayer>
  </LeafletMap>, document.getElementById('container')
  );
</script>
```

Resources
---------
Further reading:
  - http://facebook.github.io/react/
  - http://leafletjs.com/

For example usage, see examples/basic-map.html.

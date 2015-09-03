'use strict';

import centerCoords from '../util/center-coords';
import config from '../config';
import getConfig from '../util/get-config';
import { compile as compileTemplate } from 'handlebars';
import { get, parseJSON } from 'jquery';

export class LeafletMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {layerGroups: []};
  }

  componentDidMount() {
    this.initializeMap().then(map => {
      this.setState({map: map});
      this.fetchJson().then(() => {
        this.state.map.spin(false);
        this.addLayersToMap();
      });
    });
  }

  initializeMap() {
    return new Promise((resolve, reject) => {
      try {
        var map = L.map(React.findDOMNode(this), {
          minZoom: getConfig(this, 'minZoom'),
          maxZoom: getConfig(this, 'maxZoom'),
          zoomControl: getConfig(this, 'zoomControl'),
          layers: [
            L.tileLayer(getConfig(this, 'tileProvider'))
          ],
          attributionControl: false
        });

        map.setView([this.props.lat, this.props.lon], getConfig(this, 'zoom'));

        new L.Control.Zoom({
          position: getConfig(this, 'zoomControlPosition')
        }).addTo(map);

        map.on('zoomend', e => this.zoomHandler());

        resolve(map);
      } catch (err) {
        reject(err);
      }
    });
  }

  zoomHandler() {
    var map = this.state.map;
    var zoom = map.getZoom();

    return this.state.layerGroups.map(layerGroup => {
      var showZoom = layerGroup.props.props.showThreshold;
      var hideZoom = layerGroup.props.props.hideThreshold;

      if (zoom >= showZoom && zoom <= hideZoom) {
        map.addLayer(layerGroup);
      } else {
        map.removeLayer(layerGroup);
      }
    });
  }

  fetchJson() {
    var layers = this.props.children;

    if (this.props.children.constructor !== Array) { layers = [layers]; }

    this.state.map.spin(true);

    return Promise.all(layers.map(layer => {
      return new Promise((resolve, reject) => {
        get(layer.props.dataSource).then(json => {
          var parsedJson = parseJSON(json);
          var features   = this.bindPopups(layer, parsedJson);

          if (layer.props.cluster === 'true') {
            var newLayerGroup = new L.MarkerClusterGroup(config.markerClusterConfig);
            var centerPoints = this.createMarkerCluster(parsedJson);
            newLayerGroup.addLayers(centerPoints);
          } else {
            var newLayerGroup = new L.layerGroup();
            newLayerGroup.addLayer(features);
          }

          newLayerGroup.meta = parsedJson.features[0].properties;
          newLayerGroup.props = {props: layer.props};

          this.setState({layerGroups: this.state.layerGroups.concat([newLayerGroup])});

          resolve();
        });
      });
    }));
  }

  bindPopups(layer, json) {
    return L.geoJson(json, {
      onEachFeature: (feature, _layer) => {
        if (layer.props.children !== undefined) {
          var hbs = layer.props.children;
          var ctx = feature.properties;
          var template = compileTemplate(hbs);

          _layer.bindPopup(template(ctx));
        }
      }
    })
  }

  createMarkerCluster(json) {
    return json.features.map(feature => {
      try {
        var center = centerCoords(feature.geometry.coordinates[0], {debug: true});
        return new L.marker(L.latLng(center[0], center[1]), {opacity: 1.0})
      } catch (e) {
        console.log('error: ', e, ' on feature: ', feature);
      }
    });
  }

  addLayersToMap() {
    return this.zoomHandler();
  }

  render() {
    return (
      <div className="map">
        Loading map...
      </div>
    );
  }
}

export class LayerGroup extends React.Component {
  render() {
    return;
  }
}

window.LeafletMap = LeafletMap;

window.LayerGroup = LayerGroup;

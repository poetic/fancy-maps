'use strict';

import centerCoords from '../util/center-coords';
import config from '../config';
import getConfig from '../util/get-config';
import LegendControl from '../util/legend';
import _ from 'lodash';
import React from 'react';
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
        this.addLegendToMap();
      });
    });
  }

  initializeMap() {
    return new Promise((resolve, reject) => {
      try {
        var map = this.createMap();

        map.setView([this.props.lat, this.props.lon], getConfig(this, 'zoom'));

        new L.Control.Zoom({
          position: getConfig(this, 'zoomControlPosition')
        }).addTo(map);

        map.on('zoomend', () => this.zoomHandler());

        resolve(map);
      } catch (err) {
        reject(err);
      }
    });
  }

  createMap() {
    return L.map(React.findDOMNode(this), {
      minZoom: getConfig(this, 'minZoom'),
      maxZoom: getConfig(this, 'maxZoom'),
      zoomControl: getConfig(this, 'zoomControl'),
      layers: [
        L.tileLayer(getConfig(this, 'tileProvider'))
      ],
      attributionControl: false
    });
  }

  addLegendToMap() {
    var legend = new LegendControl({
      template: this.legendTemplate(),
      className: 'map-legend'
    });

    this.state.map.addControl(legend);
  }

  legendTemplate() {
    var legend = _.findLast(this.props.children, child => {
      return child.type.name === 'Legend';
    });

    return legend.props.children;
  }

  zoomHandler() {
    var map = this.state.map;
    var zoom = map.getZoom() + '';

    return this.state.layerGroups.map(layerGroup => {
      var showZoom = layerGroup.props.showThreshold;
      var hideZoom = layerGroup.props.hideThreshold;

      if (zoom >= showZoom && zoom <= hideZoom) {
        if (zoom === hideZoom && layerGroup.cluster) {
          map.addLayer(layerGroup.clusterPolygons);
        } else if (layerGroup.clusterPolygons !== undefined) {
          map.removeLayer(layerGroup.clusterPolygons);
        }

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

    return Promise.all(
      layers.filter(this.filterNonLayers).map(this.fetchJsonForLayer.bind(this))
    );
  }

  fetchJsonForLayer(layer) {
    return new Promise(resolve => {
      get(layer.props.dataSource).then(json => {
        var parsedJson = parseJSON(json);
        var features   = this.bindPopups(layer, parsedJson);
        var newLayerGroup = this.createLayer(layer, features, parsedJson);

        newLayerGroup.meta = parsedJson.features[0].properties;
        newLayerGroup.props = layer.props;

        this.setState({layerGroups: this.state.layerGroups.concat([newLayerGroup])});

        resolve();
      });
    });
  }

  createLayer(layer, features, json) {
    if (layer.props.cluster === 'true') {
      return this.createPolygonsForCluster(features, json);
    } else {
      return this.createPolygons(features);
    }
  }

  filterNonLayers(layer) {
    var blackList = ['Legend'];

    if (!_.includes(blackList, layer.type.name)) {
      return layer;
    }
  }

  createPolygons(features) {
    var layer = new L.layerGroup();
    layer.addLayer(features);
    return layer;
  }

  createPolygonsForCluster(features, json) {
    var centerPoints = this.createMarkerCluster(json);
    var layerGroup = new L.MarkerClusterGroup(config.markerClusterConfig);

    layerGroup.cluster = true;
    layerGroup.clusterPolygons = this.createPolygons(features);

    return layerGroup.addLayers(centerPoints);
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
    });
  }

  createMarkerCluster(json) {
    return json.features.map(feature => {
      try {
        var center = centerCoords(feature.geometry.coordinates[0], {debug: true});
        var blankIcon = L.divIcon({className: 'blank-icon'});

        return new L.marker(L.latLng(center[0], center[1]), {icon: blankIcon});
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

export class Legend extends React.Component {
  render() {
    return;
  }
}

window.LeafletMap = LeafletMap;

window.LayerGroup = LayerGroup;

window.Legend = Legend;

window.React = React;

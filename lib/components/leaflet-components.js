'use strict';

import centerCoords from '../util/center-coords';
import config from '../config';
import getConfig from '../util/get-config';
import L from 'leaflet';
import MarkerClusterGroup from 'leaflet.markercluster';
import LegendControl from '../util/legend';
import _ from 'lodash';
import { Promise } from 'es6-promise';
import React from 'react';
import Spinner from 'spin';
import compileTemplate from '../util/compile-template';
import { getJSON, parseJSON } from 'jquery';

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

        if (!!this.props.maxBounds) {
          map.setMaxBounds(this.getMaxBounds());
        }

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

  getMaxBounds() {
    let { maxBounds } = this.props;

    return maxBounds;
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
      return child.type.name === 'LeafletLegend';
    });

    return legend.props.children;
  }

  zoomHandler() {
    var map = this.state.map;
    var zoom = map.getZoom();

    return this.state.layerGroups.map(layerGroup => {
      var showZoom = layerGroup.props.showThreshold * 1;
      var hideZoom = layerGroup.props.hideThreshold * 1;
      var zoomOptions = this.getZoomOptions(layerGroup, hideZoom);
      var hideCluster = false;

      if (zoom >= showZoom && zoom <= hideZoom) {
        if (_.includes(zoomOptions, zoom) && !!layerGroup.cluster) {
          hideCluster = true;
          map.addLayer(layerGroup.clusterPolygons);
        } else if (!!layerGroup.clusterPolygons) {
          map.removeLayer(layerGroup.clusterPolygons);
        }

        if (hideCluster) {
          map.removeLayer(layerGroup);
        } else {
          map.addLayer(layerGroup);
        }
      } else {
        map.removeLayer(layerGroup);
      }
    });
  }

  getZoomOptions(layerGroup, hideZoom) {
    var zoomOffset = layerGroup.props.disableClusteringAtZoom || hideZoom;
    var zoomOptions = [hideZoom];
3
    if (!!zoomOffset) {
      zoomOptions = _.range(zoomOffset, hideZoom + 1);
    }

    return zoomOptions;
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
    let { dataSource, openPopupsOnHover } = layer.props;

    return new Promise((resolve, reject) => {
      if (!!dataSource) {
        return getJSON(dataSource).then(json => {
          var parsedJson = this.parseJSON(json);
          var features   = this.bindPopups(layer, parsedJson, openPopupsOnHover);
          var newLayerGroup = this.createLayer(layer, features, parsedJson);

          newLayerGroup.meta = parsedJson.features[0].properties;
          newLayerGroup.props = layer.props;

          this.setState({layerGroups: this.state.layerGroups.concat([newLayerGroup])});

          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  parseJSON(json) {
    try {
      return parseJSON(json);
    } catch (_e) {
      return json;
    }
  }

  createLayer(layer, features, json) {
    if (layer.props.cluster === 'true') {
      return this.createPolygonsForCluster(features, json);
    } else {
      return this.createPolygons(features);
    }
  }

  filterNonLayers(layer) {
    var blackList = ['LeafletLegend'];

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

  bindPopups(layer, json, hoverEnabled=false) {
    return L.geoJson(json, {
      onEachFeature: (feature, _layer) => {
        _layer.on({
          mouseover(e) {
            if (hoverEnabled) { this.openPopup(e.latlng); }
          },
          mouseout() {
            if (hoverEnabled) { this.closePopup(); }
          }
        });

        if (!!layer.props.children) {
          var hbs = layer.props.children;
          var ctx = feature.properties;
          var template = compileTemplate(hbs);

          _layer.bindPopup(template(ctx), {offset: L.point(0, -5)});
        }
      },

      style: this.styleGeoJson.bind(this, layer)
    });
  }

  styleGeoJson(layer, feature) {
    var prefix = layer.props.featureClassPrefix || 'feature';
    var className = layer.props.featureClassName;
    var classValue = feature.properties[className];

    if (!!className && !!classValue) {
      return {className: `${prefix}-${classValue}`};
    } else {
      return {className: `${prefix}-default`};
    }
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

export class LeafletLayer extends React.Component {
  render() {
    return;
  }
}

export class LeafletLegend extends React.Component {
  render() {
    return;
  }
}

window.LeafletMap = LeafletMap;

window.LeafletLayer = LeafletLayer;

window.LeafletLegend = LeafletLegend;

window.Promise = Promise;

window.React = React;

window.Spinner = Spinner;

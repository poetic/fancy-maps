"use strict";

class LeafletMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {layerGroups: []};
  }

  componentDidMount() {
    this.setState({map: this.initializeMap()});
    this.fetchJson();
    this.addLayersToMap();
  }

  initializeMap() {
    var map = L.map(React.findDOMNode(this), {
      minZoom: this.props.minZoom || 0,
      maxZoom: this.props.maxZoom || 20,
      zoomControl: this.props.zoomControl || false,
      layers: [
        L.tileLayer(this.props.tileProvider)
      ],
      attributionControl: false
    });

    map.setView([this.props.lat, this.props.lon], this.props.zoom);

    new L.Control.Zoom({
      position: this.props.zoomControlPosition || "bottomleft"
    }).addTo(map);

    map.on('zoomend', e => this.zoomHandler());

    return map;
  }

  zoomHandler(_e) {
    var map = this.state.map;
    var zoom = map.getZoom();

    this.state.layerGroups.map(layerGroup => {
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

    layers.map(layer => {
      $.get(layer.props.dataSource).done(json => {
        var newLayerGroup = L.layerGroup();
        var parsedJson    = $.parseJSON(json);
        var features      = L.geoJson(parsedJson);

        newLayerGroup.props = {props: layer.props};
        newLayerGroup.addLayer(features);

        this.setState({layerGroups: this.state.layerGroups.concat([newLayerGroup])});
      });
    });
  }

  addLayersToMap() {
    this.state.layerGroups.map(layerGroup => {
      layerGroup.addTo(this.state.map);
    });
  }

  render() {
    return (
      <div className="map">
        Loading map...
      </div>
    );
  }
}

class LayerGroup extends React.Component {
  render() {
    return;
  }
}

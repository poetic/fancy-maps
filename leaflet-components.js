"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LeafletMap = (function (_React$Component) {
  _inherits(LeafletMap, _React$Component);

  function LeafletMap(props) {
    _classCallCheck(this, LeafletMap);

    _get(Object.getPrototypeOf(LeafletMap.prototype), "constructor", this).call(this, props);
    this.state = { layerGroups: [] };
  }

  _createClass(LeafletMap, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({ map: this.initializeMap() });
      this.fetchJson();
      this.addLayersToMap();
    }
  }, {
    key: "initializeMap",
    value: function initializeMap() {
      var _this = this;

      var map = L.map(React.findDOMNode(this), {
        minZoom: this.props.minZoom || 0,
        maxZoom: this.props.maxZoom || 20,
        zoomControl: this.props.zoomControl || false,
        layers: [L.tileLayer(this.props.tileProvider)],
        attributionControl: false
      });

      map.setView([this.props.lat, this.props.lon], this.props.zoom);

      new L.Control.Zoom({
        position: this.props.zoomControlPosition || "bottomleft"
      }).addTo(map);

      map.on('zoomend', function (e) {
        return _this.zoomHandler();
      });

      return map;
    }
  }, {
    key: "zoomHandler",
    value: function zoomHandler(_e) {
      var map = this.state.map;
      var zoom = map.getZoom();

      this.state.layerGroups.map(function (layerGroup) {
        var showZoom = layerGroup.props.props.showThreshold;
        var hideZoom = layerGroup.props.props.hideThreshold;

        if (zoom >= showZoom && zoom <= hideZoom) {
          map.addLayer(layerGroup);
        } else {
          map.removeLayer(layerGroup);
        }
      });
    }
  }, {
    key: "fetchJson",
    value: function fetchJson() {
      var _this2 = this;

      var layers = this.props.children;

      if (this.props.children.constructor !== Array) {
        layers = [layers];
      }

      layers.map(function (layer) {
        $.get(layer.props.dataSource).done(function (json) {
          var newLayerGroup = L.layerGroup();
          var parsedJson = $.parseJSON(json);
          var features = L.geoJson(parsedJson);

          newLayerGroup.props = { props: layer.props };
          newLayerGroup.addLayer(features);

          _this2.setState({ layerGroups: _this2.state.layerGroups.concat([newLayerGroup]) });
        });
      });
    }
  }, {
    key: "addLayersToMap",
    value: function addLayersToMap() {
      var _this3 = this;

      this.state.layerGroups.map(function (layerGroup) {
        layerGroup.addTo(_this3.state.map);
      });
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        { className: "map" },
        "Loading map..."
      );
    }
  }]);

  return LeafletMap;
})(React.Component);

var LayerGroup = (function (_React$Component2) {
  _inherits(LayerGroup, _React$Component2);

  function LayerGroup() {
    _classCallCheck(this, LayerGroup);

    _get(Object.getPrototypeOf(LayerGroup.prototype), "constructor", this).apply(this, arguments);
  }

  _createClass(LayerGroup, [{
    key: "render",
    value: function render() {
      return;
    }
  }]);

  return LayerGroup;
})(React.Component);
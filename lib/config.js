'use strict';

// These are meant to be reasonable defaults when props are omitted.

export default {
  leaflet: {
    maxZoom: 20,
    minZoom: 0,
    tileProvider: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    zoom: 10,
    zoomControl: false,
    zoomControlPosition: "bottomleft"
  },
  markerClusterConfig: {
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true
  }
};

'use strict';

import normalizeCoords from './normalize-coords';

export default function centerCoords(pairs, opts) {
  var opts = opts || {};
  var xMin, xMax, yMin, yMax;
  var xCoords = $.map(pairs, function(i) { return normalizeCoords(i)[0] });
  var yCoords = $.map(pairs, function(i) { return normalizeCoords(i)[1] });
  var xCenter, yCenter, center;

  xMin = Math.min.apply(Math, xCoords);
  yMin = Math.min.apply(Math, yCoords);
  xMax = Math.max.apply(Math, xCoords);
  yMax = Math.max.apply(Math, yCoords);

  xCenter = xMin + ((xMax - xMin) / 2);
  yCenter = yMin + ((yMax - yMin) / 2);
  center = [xCenter, yCenter];

  if (opts.debug) {
    console.log('pairs: ' + pairs);
    console.log('length: ' + pairs.length);
    console.log('first pair: ' + normalizeCoords(pairs[0]));
    console.log('x_coords: ' + x_coords);
    console.log('x_min: ' + x_min);
    console.log('x_max: ' + x_max);
    console.log('y_coords: ' + y_coords);
    console.log('y_max: ' + y_max);
    console.log('center: ' + center);
  }

  return center;
}

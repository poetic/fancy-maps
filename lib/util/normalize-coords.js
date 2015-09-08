'use strict';

export default function normalizeCoords(pair) {
  // x < y (bad-- let's flip it around)
  if (pair[0] < pair[1]) {
    return [pair[1], pair[0]];
  // x > y (good)
  } else {
    return pair;
  }
}

'use strict';

import config from '../config';

export default (ctx, setting) => {
  return ctx.props[setting] || config.leaflet[setting];
};

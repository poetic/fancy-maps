'use strict';

export default [
  {
    name: 'if-eq',
    fn: (property, value, options) => {
      if (property === '' + value) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    }
  }
];

'use strict';

import getConfig from './get-config';
import { compile as compileTemplate } from 'handlebars';

export default class extends L.Control {
  constructor(opts) {
    super();

    opts = opts || {};

    this.options = {position: 'bottomright'};
    this.template = opts.template;
    this.className = opts.className;
  }

  onAdd(map) {
    this._div = L.DomUtil.create('div', this.className);
    this.addContent();
    return this._div;
  }

  addContent(props) {
    var hbs = this.template;
    var ctx = {};
    var template = compileTemplate(hbs);
    this._div.innerHTML = template(ctx);
  }
}

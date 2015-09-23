'use strict';

import Handlebars from 'handlebars';
import helpers from './handlebars-helpers';

export default hbs => {
  helpers.forEach(registerHelpers);

  return Handlebars.compile(hbs);
};

function registerHelpers(helper) {
  Handlebars.registerHelper(helper.name, helper.fn);
}

/* eslint-env node*/
'use strict';

const path = require('path');

module.exports = {
  name: 'ember-calendar',

  included: function(app) {
    this._super.included(app);

    app.import(path.join(app.bowerDirectory, 'interact/interact.js'));
    app.import('vendor/shims/interact.js');

    app.import('vendor/jstz.js');
    app.import('vendor/shims/jstz.js');

    if (app.env === 'test') {
      app.import(path.join(app.bowerDirectory, 'jquery-simulate/jquery.simulate.js'), {
        type: 'test'
      });
    }
  }
};

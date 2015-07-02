/* jshint node: true */
'use strict';

var path = require('path');

module.exports = {
  name: 'ember-calendar',

  included: function(app) {
    this._super.included(app);

    app.import(path.join(app.bowerDirectory, 'lodash/lodash.js'));
    app.import(path.join(app.bowerDirectory, 'interact/interact.js'));
    app.import(path.join(app.bowerDirectory, 'moment/moment.js'));
    app.import(path.join(app.bowerDirectory, 'moment-timezone/builds/moment-timezone-with-data.js'));

    app.import('vendor/ember-calendar/lodash.js', {
      type: 'vendor',
      exports: { 'lodash': ['default'] }
    });

    app.import('vendor/ember-calendar/interact.js', {
      type: 'vendor',
      exports: { 'interact': ['default'] }
    });

    if (app.env === 'test') {
      app.import(path.join(app.bowerDirectory, 'jquery-simulate/jquery.simulate.js'));
    }
  }
};

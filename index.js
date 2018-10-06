/* eslint-env node*/
'use strict';

const path = require('path');

module.exports = {
  name: 'ember-calendar',

  included: function(app) {
    this._super.included.apply(this, arguments);

    app.import('vendor/jstz.js');
    app.import('vendor/shims/jstz.js');

    var options = app.options.emberCalendar || {};

    if (!('includeFontAwesomeAssets' in options)) {
      options.includeFontAwesomeAssets = true;
    }


    if (options.includeFontAwesomeAssets) {
      app.import(path.join(app.bowerDirectory, 'fontawesome/fonts/fontawesome-webfont.ttf'), {
        destDir: 'fonts'
      });

      app.import(path.join(app.bowerDirectory, 'fontawesome/fonts/fontawesome-webfont.woff'), {
        destDir: 'fonts'
      });

      app.import(path.join(app.bowerDirectory, 'fontawesome/fonts/fontawesome-webfont.woff2'), {
        destDir: 'fonts'
      });

      app.import(path.join(app.bowerDirectory, 'fontawesome/fonts/fontawesome-webfont.svg'), {
        destDir: 'fonts'
      });

      app.import(path.join(app.bowerDirectory, 'fontawesome/fonts/fontawesome-webfont.eot'), {
        destDir: 'fonts'
      });
    }

    app.import('vendor/ember-calendar/jstz.js', {
      type: 'vendor',
      exports: { 'jstz': ['default'] }
    });

    app.import('vendor/jstz.js', {
      type: 'vendor'
    });

    if (app.env === 'test') {
      app.import(path.join(app.bowerDirectory, 'jquery-simulate/jquery.simulate.js'), {
        type: 'test'
      });
    }
  }
};

/* eslint-env node*/
'use strict';

const path = require('path');
const fastbootTransform = require('fastboot-transform');

module.exports = {
  name: 'ember-calendar',

  options: {
    nodeAssets: {
      'interactjs': {
        import: {
          include: ['interactjs'],
          processTree(input) {
            return fastbootTransform(input);
          }
        }
      }
    }
  },

  included: function(app) {
    this._super.included(app);

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

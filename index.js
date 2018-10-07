/* eslint-env node*/
'use strict';

const path = require('path');

module.exports = {
  name: 'ember-calendar',

  included: function(app) {
    this._super.included.apply(this, arguments);

    if (app.env === 'test') {
      app.import(path.join(app.bowerDirectory, 'jquery-simulate/jquery.simulate.js'), {
        type: 'test'
      });
    }
  }
};

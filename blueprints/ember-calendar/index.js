/* jshint node: true */
'use strict';

module.exports = {
  normalizeEntityName: function() {},

  beforeInstall: function() {
    return this.addPackagesToProject([
      { name: 'broccoli-sass' }
    ]);
  },

  afterInstall: function() {
    return this.addBowerPackagesToProject([
      { name: 'ember-cli-moment-shim', target: '0.2.0' },
      { name: 'interact', target: '1.2.4' },
      { name: 'jquery-simulate', target: '1.0.1' },
      { name: 'lodash', target: '3.10.0' },
      { name: 'moment', target: '2.10.2' },
      { name: 'moment-timezone', target: '0.4.0' }
    ]);
  }
};

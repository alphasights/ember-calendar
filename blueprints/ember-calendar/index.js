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
      { name: 'interact', target: '1.2.5' },
      { name: 'jquery-simulate', target: '1.0.1' },
      { name: 'lodash', target: '3.10.0' },
      { name: 'moment', target: '2.10.6' },
      { name: 'moment-timezone', target: '0.4.0' }
    ]);
  }
};

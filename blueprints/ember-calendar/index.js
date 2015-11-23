/* jshint node: true */
'use strict';

module.exports = {
  normalizeEntityName: function() {},

  beforeInstall: function() {
    return this.addPackagesToProject([
      { name: 'broccoli-sass', target: '0.7.0' },
      { name: 'ember-moment', target: '4.1.0' },
      { name: 'ember-rl-dropdown', target: '0.7.0' },
      { name: 'liquid-fire', target: '0.21.3' }
    ]);
  },

  afterInstall: function() {
    return this.addBowerPackagesToProject([
      { name: 'interact', target: '1.2.5' },
      { name: 'jquery-simulate', target: '1.0.1' },
      { name: 'lodash', target: '3.10.0' }
    ]);
  }
};

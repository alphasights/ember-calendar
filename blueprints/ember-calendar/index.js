/* jshint node: true */
'use strict';

module.exports = {
  normalizeEntityName: function() {},

  beforeInstall: function() {
    return this.addBowerPackagesToProject([
      { name: 'moment-timezone' },
      { name: 'jquery-simulate' },
      { name: 'interact' },
      { name: 'lodash' }
    ]);
  },

  afterInstall: function() {
    return this.addPackagesToProject([
      { name: 'ember-cli-paint' },
      { name: 'ember-moment' },
      { name: 'liquid-fire' }
    ]);
  }
};

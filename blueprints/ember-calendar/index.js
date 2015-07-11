/* jshint node: true */
'use strict';

module.exports = {
  normalizeEntityName: function() {},

  beforeInstall: function() {
    return this.addBowerPackagesToProject([
      { name: 'moment' },
      { name: 'ember-cli-moment-shim' },
      { name: 'moment-timezone' },
      { name: 'jquery-simulate' },
      { name: 'interact' },
      { name: 'lodash' }
    ]);
  },

  afterInstall: function() {
    return this.addPackagesToProject([
      { name: 'broccoli-sass' },
      { name: 'ember-component-inbound-actions' },
      { name: 'ember-moment' },
      { name: 'ember-rl-dropdown' }
      { name: 'liquid-fire' }
    ]);
  }
};

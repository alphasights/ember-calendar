/* jshint node: true */
'use strict';

module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addAddonsToProject({
      packages: [{ name: 'ember-moment', target: '4.1.0' }]
    }).then(() => {
      return this.addPackagesToProject([
        { name: 'broccoli-sass', target: '0.7.0' },
        { name: 'ember-component-inbound-actions', target: '0.0.4' },
        { name: 'ember-rl-dropdown', target: '0.7.0' },
        { name: 'liquid-fire', target: '0.21.3' }
      ]);
    }).then(() => {
      return this.addBowerPackagesToProject([
        { name: 'interact', target: '1.2.5' },
        { name: 'jquery-simulate', target: '1.0.1' },
        { name: 'lodash', target: '3.10.0' }
      ]);
    });
  }
};

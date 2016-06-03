/* jshint node: true */
'use strict';

module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    var self = this;

    return self.addAddonsToProject({
      packages: [{ name: 'ember-moment', target: '6.0.0' }]
    }).then(function() {
      return self.addPackagesToProject([
        { name: 'broccoli-sass', target: '0.7.0' },
        { name: 'ember-component-inbound-actions', target: '0.0.4' },
        { name: 'ember-rl-dropdown', target: '0.7.0' },
        { name: 'liquid-fire', target: '0.21.3' }
      ]);
    }).then(function() {
      return self.addBowerPackagesToProject([
        { name: 'interact', target: '1.2.5' },
        { name: 'jquery-simulate', target: '1.0.1' },
        { name: 'lodash', target: '3.10.0' },
        { name: 'fontawesome', target: '~4.5.0'}
      ]);
    });
  }
};

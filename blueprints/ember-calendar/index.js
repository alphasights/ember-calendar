/* eslint-env node*/
'use strict';

module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    var self = this;

    return self.addAddonsToProject({
      packages: [{ name: 'ember-moment', target: '7.3.0' }]
    }).then(function() {
      return self.addPackagesToProject([
        { name: 'ember-cli-sass', target: '5.3.1' },
        { name: 'ember-rl-dropdown', target: '0.7.0' },
        { name: 'liquid-fire', target: '0.21.3' }
      ]);
    }).then(function() {
      return self.addBowerPackagesToProject([
        { name: 'interact', target: 'unstable' },
        { name: 'jquery-simulate', target: '1.0.1' },
        { name: 'fontawesome', target: '~4.5.0'},
        { name: 'jquery-simulate', target: '1.0.1' }
      ]);
    });
  }
};

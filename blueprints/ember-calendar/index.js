/* jshint node: true */
'use strict';

module.exports = {
  afterInstall: function() {
    this.addPackagesToProject([
      { name: 'ember-cli-paint' },
      { name: 'ember-cli-lodash' },
      { name: 'ember-moment' }
    ]);

    this.addBowerPackagesToProject([
      { name: 'moment-timezone' },
      { name: 'interact' },
      { name: 'lodash' }
    ]);
  }
};

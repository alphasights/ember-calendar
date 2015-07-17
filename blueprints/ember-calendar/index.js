/* jshint node: true */
'use strict';

module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addBowerPackagesToProject([
      { name: 'ember-cli-moment-shim': '~0.2.0' },
      { name: 'interact': '~1.2.4' },
      { name: 'jquery-simulate': '~1.0.1' },
      { name: 'lodash': '~3.10.0' },
      { name: 'moment': '~2.10.2' },
      { name: 'moment-timezone': '~0.4.0' }
    ]);
  }
};

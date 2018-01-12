module.exports = {
  useYarn: true,
  scenarios: [
    {
      name: 'ember-lts-2.12',
      npm: {
        devDependencies: {
          'ember-source': '~2.12.0'
        }
      }
    },
    {
      name: 'ember-lts-2.16',
      npm: {
        devDependencies: {
          'ember-source': '~2.16.0'
        }
      }
    },
    {
      name: 'ember-release',
      npm: {
        devDependencies: {
          'ember-source': 'http://builds.emberjs.com/release.tgz'
        }
      }
    },
    {
      name: 'ember-beta',
      npm: {
        devDependencies: {
          'ember-source': 'http://builds.emberjs.com/beta.tgz'
        }
      }
    },
    {
      name: 'ember-canary',
      allowedToFail: true,
      npm: {
        devDependencies: {
          'ember-source': 'http://builds.emberjs.com/canary.tgz'
        }
      }
    },
    {
      name: 'ember-default',
      npm: {
        devDependencies: {}
      }
    }
  ]
};

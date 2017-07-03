import {collidesWith} from 'ember-calendar/utils/occurrence-packer';
import {module, test} from 'qunit';
import Ember from 'ember';

module('Unit | Utility | occurrence packer');

// Replace this with your real tests.
test('detects collisions', function (assert) {
  const collisions = [
    // b intersects a
    [
      ['2017-06-18T17:00:00Z', '2017-06-18T18:00:00Z'],
      ['2017-06-18T17:30:00Z', '2017-06-18T19:00:00Z']
    ],
    // a in b
    [
      ['2017-06-18T17:00:00Z', '2017-06-18T18:00:00Z'],
      ['2017-06-18T16:30:00Z', '2017-06-18T18:30:00Z']
    ],
    // b in a
    [
      ['2017-06-18T17:00:00Z', '2017-06-18T18:00:00Z'],
      ['2017-06-18T17:30:00Z', '2017-06-18T17:45:00Z']
    ],
  ];

  collisions.forEach(([[aStart, aEnd], [bStart, bEnd]]) => {
    assert.ok(collidesWith(
      Ember.Object.create({
        startsAt: new Date(aStart),
        endsAt: new Date(aEnd)
      }),
      Ember.Object.create({
        startsAt: new Date(bStart),
        endsAt: new Date(bEnd),
      })));
  });
});

import Ember from 'ember';
import { test, module } from 'ember-qunit';
import computedMoment from 'ember-calendar/macros/computed-moment';
import moment from 'moment';

module('macros | computed moment', 'computedMoment');

test('it returns a moment when getting', function(assert) {
  assert.expect(1);

  let date = new Date();

  let Component = Ember.Object.extend({
    _startingTime: date,
    timeZone: 'Australia/Sydney',

    startingTime: computedMoment('_startingTime', 'timeZone')
  });

  let subject = Component.create();
  let startingTime = subject.get('startingTime');
  let expected = moment(date).tz('Australia/Sydney');

  assert.equal(startingTime.toString(), expected.toString());
});

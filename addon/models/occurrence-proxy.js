import Ember from 'ember';
import moment from 'moment';
import computedMoment from 'ember-calendar/macros/computed-moment';

export default Ember.Object.extend({
  calendar: null,
  content: null,
  startingTime: computedMoment('content.startsAt'),
  title: Ember.computed.oneWay('content.title'),

  duration: Ember.computed('startingTime', '_endingTime', function() {
    return moment.duration(
      this.get('_endingTime').diff(this.get('startingTime'))
    );
  }),

  _endingTime: computedMoment('content.endsAt')
});

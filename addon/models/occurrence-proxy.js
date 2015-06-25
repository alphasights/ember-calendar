import Occurrence from './occurrence';
import Ember from 'ember';
import computedMoment from 'ember-calendar/macros/computed-moment';

export default Occurrence.extend({
  content: null,
  endingTime: computedMoment('content.endsAt'),
  startingTime: computedMoment('content.startsAt'),
  title: Ember.computed.oneWay('content.title'),

  duration: Ember.computed('startingTime', 'endingTime', function() {
    return moment.duration(
      this.get('endingTime').diff(this.get('startingTime'))
    );
  })
});

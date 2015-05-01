import moment from 'moment';
import Ember from 'ember';
import Time from './time';

export default Time.extend({
  offset: moment.duration(),
  duration: Ember.computed.oneWay('calendar.timeSlotDuration'),
  localTimeZoneOffset: Ember.computed.oneWay('calendar.localTimeZoneOffset'),

  endingOffset: Ember.computed('offset', 'duration', function() {
    return moment.duration(this.get('offset')).add(this.get('duration'));
  }),

  value: Ember.computed('offset', 'localTimeZoneOffset', function() {
    return moment()
      .startOf('day')
      .add(this.get('offset'))
      .subtract(this.get('localTimeZoneOffset'), 'minutes');
  })
});

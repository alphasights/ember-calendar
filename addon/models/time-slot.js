import moment from 'moment';
import Ember from 'ember';

var TimeSlot = Ember.Object.extend({
  timeZone: null,
  offset: 0,

  day: Ember.computed('timeZone', function() {
    return moment().utc().tz(this.get('timeZone')).startOf('day');
  }),

  value: Ember.computed('day', 'offset', function(){
    return moment(this.get('day')).add(this.get('offset'), 'minutes');
  }),

  isInRange: function(startingHour, endingHour) {
    var value = this.get('value');
    var hour = value.get('hour');

    return value.isSame(this.get('day'), 'day') &&
           hour >= startingHour &&
           hour <= endingHour;
  },

  next: function(minutes) {
    return TimeSlot.create({
      timeZone: this.get('timeZone'),
      offset: this.get('offset') + minutes
    });
  }
});

TimeSlot.reopenClass({
  createList: function(options) {
    var timeSlots = Ember.A();

    var currentTimeSlot = this.create({
      timeZone: options.timeZone,
      offset: options.dayStartingHour * 60
    });

    while (currentTimeSlot.isInRange(
      options.dayStartingHour,
      options.dayEndingHour
    )) {
      timeSlots.pushObject(currentTimeSlot);
      currentTimeSlot = currentTimeSlot.next(options.minutes);
    }

    return timeSlots;
  }
});

export default TimeSlot;

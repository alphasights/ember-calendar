import moment from 'moment';
import Ember from 'ember';

var TimeSlot = Ember.Object.extend({
  duration: null,
  time: null,
  timeZone: null,

  day: Ember.computed('timeZone', function() {
    return moment().utc().tz(this.get('timeZone')).startOf('day');
  }),

  value: Ember.computed('day', 'time', function() {
    return moment(this.get('day')).add(this.get('time'));
  }),

  endingValue: Ember.computed('value', 'duration', function() {
    return moment(this.get('value')).add(this.get('duration'));
  }),

  isValidInRange: function(startingTime, endingTime) {
    var value = this.get('value');
    var day = this.get('day');

    return value.isSame(this.get('day'), 'day') &&
           value >= moment(day).add(startingTime) &&
           this.get('endingValue') <= moment(day).add(endingTime);
  },

  next: function() {
    var duration = this.get('duration');

    return TimeSlot.create({
      timeZone: this.get('timeZone'),
      time: moment.duration(this.get('time')).add(duration),
      duration: duration
    });
  }
});

TimeSlot.reopenClass({
  buildDay: function(options) {
    var timeSlots = Ember.A();

    var currentTimeSlot = this.create({
      timeZone: options.timeZone,
      time: options.startingTime,
      duration: options.duration
    });

    while (currentTimeSlot.isValidInRange(
      options.startingTime,
      options.endingTime
    )) {
      timeSlots.pushObject(currentTimeSlot);
      currentTimeSlot = currentTimeSlot.next();
    }

    return timeSlots;
  }
});

export default TimeSlot;

import Ember from 'ember';
import _ from 'lodash';
import moment from 'moment';
import TimeSlot from './time-slot';
import Day from './day';

export default Ember.Object.extend({
  occurrences: null,
  startingDate: null,
  timeSlotMinutes: null,

  isInCurrentWeek: Ember.computed('week', '_currentWeek', function() {
    return this.get('week').isSame(this.get('_currentWeek'));
  }),

  timeSlots: Ember.computed(
    'timeZone',
    'dayStartingHour',
    'dayEndingHour',
    'timeSlotMinutes', function() {
    return TimeSlot.createList({
      timeZone: this.get('timeZone'),
      dayStartingHour: this.get('dayStartingHour'),
      dayEndingHour: this.get('dayEndingHour'),
      minutes: this.get('timeSlotMinutes')
    });
  }),

  days: Ember.computed(function() {
    return _.range(0, 6).map((dayOffset) => {
      return Day.create({
        calendar: this,
        offset: dayOffset
      });
    });
  }),

  week: Ember.computed('startingDate', 'timeZone', function(_, value) {
    if (arguments.length > 1) {
      this.set('startingDate', value.toDate());
    }

    return moment(this.get('startingDate'))
      .utc()
      .tz(this.get('timeZone'))
      .startOf('week');
  }),

  _currentWeek: Ember.computed('timeZone', function() {
    return moment().utc().tz(this.get('timeZone')).startOf('week');
  }),

  initializeCalendar: Ember.on('init', function() {
    if (this.get('startingDate') == null) {
      this.goToCurrentWeek();
    }
  }),

  navigateWeek: function(index) {
    this.set('week', moment(this.get('week')).add(index, 'weeks'));
  },

  goToCurrentWeek: function() {
    this.set('week', moment(this.get('_currentWeek')));
  }
});

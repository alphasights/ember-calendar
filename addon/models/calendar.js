import Ember from 'ember';
import moment from 'moment';
import TimeSlot from './time-slot';
import Day from './day';
import computedDuration from 'ember-calendar/macros/computed-duration';

export default Ember.Object.extend({
  dayEndingTime: null,
  dayStartingTime: null,
  occurrences: null,
  startingDate: null,
  timeSlotDuration: null,
  timeZone: null,

  isInCurrentWeek: Ember.computed('week', '_currentWeek', function() {
    return this.get('week').isSame(this.get('_currentWeek'));
  }),

  timeSlots: Ember.computed(
    'timeZone',
    '_dayStartingTime',
    '_dayEndingTime',
    '_timeSlotDuration', function() {
    return TimeSlot.buildDay({
      timeZone: this.get('timeZone'),
      startingTime: this.get('_dayStartingTime'),
      endingTime: this.get('_dayEndingTime'),
      duration: this.get('_timeSlotDuration')
    });
  }),

  days: Ember.computed(function() {
    return Day.buildWeek({ calendar: this });
  }),

  week: Ember.computed('startingDate', 'timeZone', function(_, value) {
    if (arguments.length > 1) {
      this.set('startingDate', value.toDate());
    }

    var startingDate = this.get('startingDate');
    var timeZone = this.get('timeZone');

    return moment(startingDate)
      .startOf('week')
      .utc()
      .tz(this.get('timeZone'))
      .subtract(startingDate.getTimezoneOffset() -
                moment.tz.zone(timeZone).offset(startingDate.getTime()), 'minutes');
  }),

  _dayStartingTime: computedDuration('dayStartingTime'),
  _dayEndingTime: computedDuration('dayEndingTime'),
  _timeSlotDuration: computedDuration('timeSlotDuration'),

  _currentWeek: Ember.computed('timeZone', function() {
    return moment().tz(this.get('timeZone')).startOf('week').utc();
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

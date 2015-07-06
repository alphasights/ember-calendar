import Ember from 'ember';
import moment from 'moment';
import TimeSlot from './time-slot';
import Day from './day';
import OccurrenceProxy from './occurrence-proxy';

export default Ember.Object.extend({
  dayEndingTime: null,
  dayStartingTime: null,
  occurrences: null,
  startingDate: null,
  timeSlotDuration: null,
  timeZone: null,
  occurrencePreview: null,

  isInCurrentWeek: Ember.computed('week', '_currentWeek', function() {
    return this.get('week').isSame(this.get('_currentWeek'));
  }),

  timeSlots: Ember.computed(
    'timeZone',
    'dayStartingTime',
    'dayEndingTime',
    'timeSlotDuration', function() {
    return TimeSlot.buildDay({
      timeZone: this.get('timeZone'),
      startingTime: this.get('dayStartingTime'),
      endingTime: this.get('dayEndingTime'),
      duration: this.get('timeSlotDuration')
    });
  }),

  days: Ember.computed(function() {
    return Day.buildWeek({ calendar: this });
  }),

  week: Ember.computed('startingDate', 'timeZone', function() {
    return moment(this.get('startingDate')).tz(this.get('timeZone')).startOf('isoWeek');
  }),

  _currentWeek: Ember.computed('timeZone', function() {
    return moment().tz(this.get('timeZone')).startOf('isoWeek');
  }),

  initializeCalendar: Ember.on('init', function() {
    if (this.get('startingDate') == null) {
      this.goToCurrentWeek();
    }
  }),

  createOccurrence: function(options) {
    var content = Ember.merge({
      endsAt: moment(options.startsAt)
        .add(this.get('defaultOccurrenceDuration')),

      title: this.get('defaultOccurrenceTitle')
    }, options);

    return OccurrenceProxy.create({
      calendar: this,
      content: Ember.Object.create(content)
    });
  },

  navigateWeek: function(index) {
    this.set('startingDate', moment(this.get('startingDate')).add(index, 'weeks'));
  },

  goToCurrentWeek: function() {
    this.set('startingDate', new Date());
  }
});

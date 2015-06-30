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

  week: Ember.computed('startingDate', 'timeZone', {
    get() {
      var startingDate = this.get('startingDate');
      var timeZone = this.get('timeZone');

      return moment(startingDate)
        .startOf('week')
        .utc()
        .tz(this.get('timeZone'))
        .subtract(startingDate.getTimezoneOffset() -
                  moment.tz.zone(timeZone)
                    .offset(startingDate.getTime()), 'minutes');
    },

    set(_, value) {
      this.set('startingDate', value.toDate());
      return value;
    }
  }),

  _currentWeek: Ember.computed('timeZone', function() {
    return moment().tz(this.get('timeZone')).startOf('week').utc();
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

  createOccurrencePreview: function(occurrence) {
    this.set('occurrencePreview', OccurrenceProxy.create({
      content: Ember.Object.create({
        startsAt: occurrence.get('content.startsAt'),
        endsAt: occurrence.get('content.endsAt'),
        title: occurrence.get('content.title')
      })
    }));
  },

  clearOccurrencePreview: function() {
    this.set('occurrencePreview', null);
  },

  navigateWeek: function(index) {
    this.set('week', moment(this.get('week')).add(index, 'weeks'));
  },

  goToCurrentWeek: function() {
    this.set('week', moment(this.get('_currentWeek')));
  }
});

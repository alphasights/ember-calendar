import Ember from 'ember';
import Calendar from 'ember-calendar/models/calendar';
import TimeZoneOption from 'ember-calendar/models/time-zone-option';

var ComponentCalendar = Calendar.extend({
  component: null,
  occurrences: Ember.computed.oneWay('component.occurrences'),
  timeZone: Ember.computed.oneWay('component.timeZone'),
  startingDate: Ember.computed.oneWay('component.startingDate'),
  dayStartingHour: Ember.computed.oneWay('component.dayStartingHour'),
  dayEndingHour: Ember.computed.oneWay('component.dayEndingHour'),
  timeSlotMinutes: Ember.computed.oneWay('component.timeSlotMinutes')
});

export default Ember.Component.extend({
  classNameBindings: [':as-calendar'],

  dayEndingHour: 22,
  dayStartingHour: 7,
  defaultTimeZoneRegexp: /New York|London|Dubai|Hong Kong/,
  isEditing: true,
  occurrences: null,
  startingDate: null,
  timeSlotHeight: 20,
  timeSlotMinutes: 30,
  timeZone: 'UTC',
  title: '',
  _model: null,

  timeSlots: Ember.computed.oneWay('_model.timeSlots'),
  days: Ember.computed.oneWay('_model.days'),
  isInCurrentWeek: Ember.computed.oneWay('_model.isInCurrentWeek'),

  headerTimeSlots: Ember.computed('timeSlots.[]', function() {
    return this.get('timeSlots').filter(function(_, index) {
      return (index % 2) === 0;
    });
  }),

  timeSlotsHeaderStyle: Ember.computed('timeSlotHeight', function() {
    var timeSlotHeight = this.get('timeSlotHeight');

    return (`margin-top: -${timeSlotHeight}px;
             line-height: ${timeSlotHeight * 2}px;`).htmlSafe();
  }),

  timeSlotStyle: Ember.computed('timeSlotHeight', function() {
    return (`height: ${2 * this.get('timeSlotHeight')}px;`).htmlSafe();
  }),

  dayStyle: Ember.computed('days.length', function() {
    return (`width: ${100 / this.get('days.length')}%;`).htmlSafe();
  }),

  initializeCalendar: function() {
    if (this.get('occurrences') == null) {
      this.set('occurrences', []);
    }

    if (this.get('startingDate') == null) {
      this.set('startingDate',
        moment()
          .utc()
          .timezone(this.get('timeZone'))
          .startOf('week')
          .toDate());
    }

    this.set('_model', ComponentCalendar.create({ component: this }));
  }.on('init'),

  addOccurrence: function(occurrence) {
    this.sendAction('onAddOccurrence', occurrence);
  },

  removeOccurrence: function(occurrence) {
    this.sendAction('onRemoveOccurrence', occurrence);
  },

  actions: {
    onSelectTimeZone: function(timeZone) {
      this.set('timeZone', timeZone);
    },

    navigateWeek: function(index) {
      this.get('_model').navigateWeek(index);
    },

    goToCurrentWeek: function() {
      this.get('_model').goToCurrentWeek();
    },
  }
});

import Ember from 'ember';
import ComponentCalendar from 'ember-calendar/models/component-calendar';

export default Ember.Component.extend({
  classNameBindings: [':as-calendar'],
  tagName: 'section',

  dayEndingTime: '22:00',
  dayStartingTime: '8:00',
  defaultTimeZoneRegexp: /New York|London|Dubai|Hong Kong/,
  isEditing: true,
  model: null,
  occurrences: null,
  startingDate: null,
  timeSlotDuration: '00:30',
  timeSlotHeight: 20,
  timeZone: 'UTC',
  title: null,

  initializeModel: function() {
    this.set('model', ComponentCalendar.create({ component: this }));
  }.on('init'),

  addOccurrence: function(occurrence) {
    this.sendAction('onAddOccurrence', occurrence);
  },

  removeOccurrence: function(occurrence) {
    this.sendAction('onRemoveOccurrence', occurrence);
  },

  actions: {
    onChangeTimetableTimeZone: function(timeZone) {
      this.set('timeZone', timeZone);
    }
  }
});

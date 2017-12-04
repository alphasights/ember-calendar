import { on } from '@ember/object/evented';
import Component from '@ember/component';
import ComponentCalendar from 'ember-calendar/models/component-calendar';

export default Component.extend({
  classNameBindings: [':as-calendar'],
  tagName: 'section',

  dayEndingTime: '22:00',
  dayStartingTime: '8:00',
  defaultOccurrenceDuration: '1:00',
  defaultOccurrenceTitle: 'New event',
  isEditing: true,
  model: null,
  occurrences: null,
  showHeader: true,
  startingDate: null,
  startFromDate: null,
  timeSlotDuration: '00:30',
  timeSlotHeight: 20,
  title: null,

  _initializeModel: on('init', function() {
    this.set('model', ComponentCalendar.create({ component: this }));
  }),

  actions: {
    addOccurrence: function(time) {
      var occurrence = this.get('model').createOccurrence({
        startsAt: time.toDate()
      });

      this.attrs['onAddOccurrence'](occurrence.get('content'));
    },

    onNavigateWeek: function(index) {
      if (this.attrs['onNavigateWeek']) {
        this.attrs['onNavigateWeek'](index);
      }
    }
  }
});

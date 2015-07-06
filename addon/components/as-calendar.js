import jstz from 'jstz';
import Ember from 'ember';
import ComponentCalendar from 'ember-calendar/models/component-calendar';

export default Ember.Component.extend({
  classNameBindings: [':as-calendar'],
  tagName: 'section',

  dayEndingTime: '22:00',
  dayStartingTime: '8:00',
  defaultOccurrenceDuration: '1:00',
  defaultOccurrenceTitle: 'New event',
  defaultTimeZoneRegexp: /New York|London|Dubai|Hong Kong/,
  isEditing: true,
  model: null,
  modelTimeSlotDuration: Ember.computed.oneWay('model.timeSlotDuration'),
  occurrences: null,
  startingDate: null,
  timeSlotDuration: '00:30',
  timeSlotHeight: 20,
  timeZone: jstz.determine().name(),
  title: null,

  _initializeModel: Ember.on('init', function() {
    this.set('model', ComponentCalendar.create({ component: this }));
  }),

  actions: {
    changeTimeZone: function(timeZone) {
      this.set('timeZone', timeZone);
    },

    addOccurrence: function(time) {
      var occurrence = this.get('model').createOccurrence({
        startsAt: time.toDate()
      });

      this.sendAction('onAddOccurrence', occurrence.get('content'));
    },

    updateOccurrence: function() {
      this.sendAction('onUpdateOccurrence', ...arguments);
    },

    removeOccurrence: function() {
      this.sendAction('onRemoveOccurrence', ...arguments);
    }
  }
});

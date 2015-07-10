import jstz from 'jstz';
import Ember from 'ember';
import ComponentCalendar from 'ember-calendar/models/component-calendar';
import InboundActionsMixin from 'ember-component-inbound-actions/inbound-actions';

export default Ember.Component.extend(InboundActionsMixin, {
  classNameBindings: [':as-calendar'],
  tagName: 'section',

  dayEndingTime: '22:00',
  dayStartingTime: '8:00',
  defaultOccurrenceDuration: '1:00',
  defaultOccurrenceTitle: 'New event',
  defaultTimeZoneQuery: '',
  isEditing: true,
  model: null,
  occurrences: null,
  showHeader: true,
  startingDate: null,
  timeSlotDuration: '00:30',
  timeSlotHeight: 20,
  timeZone: jstz.determine().name(),
  timeZoneSearchEnabled: true,
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

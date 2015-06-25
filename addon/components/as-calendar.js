import Ember from 'ember';
import ComponentCalendar from 'ember-calendar/models/component-calendar';
import Occurrence from 'ember-calendar/models/occurrence';
import moment from 'moment';

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
  timeZone: 'UTC',
  title: null,

  initializeModel: function() {
    this.set('model', ComponentCalendar.create({ component: this }));
  }.on('init'),

  actions: {
    changeTimeZone: function(timeZone) {
      this.set('timeZone', timeZone);
    },

    addOccurrence: function(time) {
      var occurrence = Occurrence.create({
        calendar: this.get('model'),
        startingTime: time,
        title: this.get('defaultOccurrenceTitle'),
        duration: moment.duration(this.get('defaultOccurrenceDuration'))
      });

      this.sendAction('onAddOccurrence', Ember.Object.create({
        title: occurrence.get('title'),
        startsAt: occurrence.get('startingTime').toDate(),
        endsAt: occurrence.get('endingTime').toDate()
      }));
    }
  }
});

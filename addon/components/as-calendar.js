import Ember from 'ember';
import ComponentCalendar from 'ember-calendar/models/component-calendar';
import moment from 'moment';

export default Ember.Component.extend({
  classNameBindings: [':as-calendar'],
  tagName: 'section',

  dayEndingTime: '22:00',
  dayStartingTime: '8:00',
  defaultTimeZoneRegexp: /New York|London|Dubai|Hong Kong/,
  defaultOccurrenceTitle: 'New event',
  defaultOccurrenceDuration: '1:00',
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

  actions: {
    changeTimeZone: function(timeZone) {
      this.set('timeZone', timeZone);
    },

    addOccurrence: function(time) {
      this.sendAction('onAddOccurrence', Ember.Object.create({
        title: this.get('defaultOccurrenceTitle'),
        startsAt: time,
        endsAt: moment(time).add(moment.duration(this.get('defaultOccurrenceDuration')))
      }));
    }
  }
});

import computedDuration from 'ember-calendar/macros/computed-duration';
import Calendar from 'ember-calendar/models/calendar';

export default Calendar.extend({
  component: null,
  timeZone: Ember.computed.oneWay('component.timeZone'),
  startingDate: Ember.computed.oneWay('component.startingDate'),
  dayStartingTime: computedDuration('component.dayStartingTime'),
  dayEndingTime: computedDuration('component.dayEndingTime'),
  timeSlotDuration: computedDuration('component.timeSlotDuration'),

  occurrences: Ember.computed('component.occurrences.[]', {
    get() {
      return this.get('component.occurrences');
    },

    set(_, value) {
      this.set('component.occurrences', value.map(function(occurrence) {
        return Occurrence.create({ calendar: this, content: occurrence });
      }));
    }
  })
});

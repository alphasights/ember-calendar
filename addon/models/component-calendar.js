import Ember from 'ember';
import computedDuration from 'ember-calendar/macros/computed-duration';
import Calendar from './calendar';
import OccurrenceProxy from './occurrence-proxy';

export default Calendar.extend({
  component: null,
  timeZone: Ember.computed.oneWay('component.timeZone'),
  startingDate: Ember.computed.oneWay('component.startingDate'),
  dayStartingTime: computedDuration('component.dayStartingTime'),
  dayEndingTime: computedDuration('component.dayEndingTime'),
  timeSlotDuration: computedDuration('component.timeSlotDuration'),

  occurrences: Ember.computed('component.occurrences.[]', function() {
    return this.get('component.occurrences').map((occurrence) => {
      return OccurrenceProxy.create({ calendar: this, content: occurrence });
    });
  })
});

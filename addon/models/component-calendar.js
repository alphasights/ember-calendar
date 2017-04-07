import Ember from 'ember';
import computedMoment from 'ember-calendar/macros/computed-moment';
import computedDuration from 'ember-calendar/macros/computed-duration';
import Calendar from './calendar';
import OccurrenceProxy from './occurrence-proxy';

export default Calendar.extend({
  component: null,
  timeZone: Ember.computed.reads('component.timeZone'),
  startingTime: computedMoment('component.startingDate'),
  dayStartingTime: computedDuration('component.dayStartingTime'),
  dayEndingTime: computedDuration('component.dayEndingTime'),
  timeSlotDuration: computedDuration('component.timeSlotDuration'),
  weekStart: Ember.computed.reads('component.weekStart'),

  defaultOccurrenceTitle: Ember.computed.reads(
    'component.defaultOccurrenceTitle'
  ),

  defaultOccurrenceDuration: computedDuration(
    'component.defaultOccurrenceDuration'
  ),

  occurrences: Ember.computed('component.occurrences.[]', function() {
    return this.get('component.occurrences').map((occurrence) => {
      return OccurrenceProxy.create({ calendar: this, content: occurrence });
    });
  })
});

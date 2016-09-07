import range from 'ember-calendar/utils/range';
import Ember from 'ember';

export default Ember.Controller.extend({
  dateFormatOptions: {
    dayHeader: 'MMMM YYYY',
    dayContent: 'dddd DD'
  },
  timeSlotLabelFormat: 'h:mma',
  nowTimeLabelFormat: 'h:mm',
  selections: null,
  occurrences: null,
  showResults: false,
  timeOptions: [],
  selectedStartingTime: 8,
  selectedEndingTime: 21,
  dayStartingTime: Ember.computed('selectedStartingTime', function () {
    return `${this.get('selectedStartingTime')}:00`;
  }),
  dayEndingTime: Ember.computed('selectedEndingTime', function () {
    return `${this.get('selectedEndingTime')}:00`;
  }),
  _initializeDefaults: Ember.on('init', function() {
    if (this.get('selections') == null) {
      this.set('selections', Ember.A());
    }

    if (this.get('occurrences') == null) {
      this.set('occurrences', Ember.A());
    }

    this.set('timeOptions', range(24));
  }),

  actions: {
    calendarAddOccurrence: function(occurrence) {
      this.get('occurrences').pushObject(Ember.Object.create({
        title: occurrence.get('title'),
        startsAt: occurrence.get('startsAt'),
        endsAt: occurrence.get('endsAt')
      }));
    },

    calendarClickOccurrence(occurrence) {
      window.alert('I was clicked!');
      console.log(`I start at ${occurrence.get('startsAt')}`);
    },

    calendarUpdateOccurrence: function(occurrence, properties) {
      occurrence.setProperties(properties);
    },

    calendarRemoveOccurrence: function(occurrence) {
      this.get('occurrences').removeObject(occurrence);
    },

    calendarEditOccurrence: function(occurrence) {
      console.log('Edit', occurrence);
    },

    calendarNavigate(props) {
      console.log(props);
    },

    onStartTimeSelected(time) {
      this.set('selectedStartingTime', time);
    },

    onEndTimeSelected(time) {
      this.set('selectedEndingTime', time);
    },
  }
});

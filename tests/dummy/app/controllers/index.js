import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
  selections: null,
  occurrences: null,

  _initializeDefaults: Ember.on('init', function() {
    if (this.get('selections') == null) {
      this.set('selections', Ember.A());
    }

    if (this.get('occurrences') == null) {
      this.set('occurrences', Ember.A());
    }
  }),

  actions: {
    calendarAddOccurrence: function(occurrence) {
      this.get('occurrences').pushObject(Ember.Object.create({
        title: occurrence.get('title'),
        startsAt: occurrence.get('startsAt'),
        endsAt: occurrence.get('endsAt')
      }));
    },

    calendarUpdateOccurrence: function(occurrence, properties) {
      occurrence.setProperties(properties);
    }
  }
});

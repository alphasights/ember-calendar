import Ember from 'ember';
import {pack} from 'ember-calendar/utils/occurrence-packer';

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
      pack(this.get('occurrences'));
    },

    calendarUpdateOccurrence: function(occurrence, properties) {
      occurrence.setProperties(properties);
      pack(this.get('occurrences'));
    },

    calendarRemoveOccurrence: function(occurrence) {
      this.get('occurrences').removeObject(occurrence);
      pack(this.get('occurrences'));
    }
  }
});

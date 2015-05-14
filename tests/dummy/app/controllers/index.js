import Ember from 'ember';
import Occurrence from 'ember-calendar/models/occurrence';

export default Ember.Controller.extend({
  selections: [],
  occurrences: [],

  actions: {
    onCalendarAddSelection: function() {

    },

    onCalendarRemoveSelection: function() {

    },

    onCalendarDayToggleSelection: function(params) {
      var selections = this.get('selections');

      if (params.value) {
        selections.pushObject(Occurrence.create({
          day: params.day.get('serializedValue')
        }));
      } else {
        selections.removeObject(selections.findBy('day'), params.day.get('serializedValue'));
      }
    }
  }
});

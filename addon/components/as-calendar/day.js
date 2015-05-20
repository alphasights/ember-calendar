import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':as-calendar-day'],

  day: null,
  value: Ember.computed.oneWay('day.value'),
  timeSlots: Ember.computed.oneWay('day.calendar.timeSlots'),

  isSelected: Ember.computed('day.isSelected', function(_, value) {
    if (arguments.length > 1) {
      this.sendAction('onToggleSelect', this.get('day'), value);
    }

    return this.get('day.isSelected');
  }),

  selectCheckboxId: Ember.computed('elementId', function() {
    return `${this.get('elementId')}-checkbox`;
  })
});

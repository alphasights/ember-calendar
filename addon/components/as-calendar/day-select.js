import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':as-calendar-day-select'],

  day: null,

  isSelected: Ember.computed('day.isSelected', function(_, value) {
    if (arguments.length > 1) {
      this.sendAction('onToggleSelect', this.get('day'), value);
    }

    return this.get('day.isSelected');
  }),

  checkboxId: Ember.computed('elementId', function() {
    return `${this.get('elementId')}-checkbox`;
  })
});

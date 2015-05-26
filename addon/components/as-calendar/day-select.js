import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':as-calendar-day-select'],

  day: null,

  isSelected: Ember.computed('day.isSelected', {
    get() {
      return this.get('day.isSelected');
    },

    set(_, value) {
      this.sendAction('onToggleSelect', this.get('day'), value);
      return value;
    }
  }),

  checkboxId: Ember.computed('elementId', function() {
    return `${this.get('elementId')}-checkbox`;
  })
});

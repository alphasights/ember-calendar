import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':as-calendar-time-zone-option', 'isSelected:selected'],

  option: null,
  select: null,
  selectedOption: Ember.computed.oneWay('select.selectedOption'),

  isSelected: Ember.computed('selectedOption', 'option', function() {
    return this.get('selectedOption') === this.get('option');
  }),

  click: function() {
    this.sendAction('onSelect', this.get('option'));
  }
});

import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':as-calendar-time-zone-option', 'isSelected:selected'],

  option: null,
  selectedOption: null,
  description: Ember.computed.oneWay('option.description'),

  isSelected: Ember.computed(
    'selectedOption.value',
    'option.value', function() {
      return this.get('selectedOption.value') === this.get('option.value');
  }),

  selectOption: Ember.on('click', function() {
    this.sendAction('onSelect', this.get('option'));
  })
});

import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':as-calendar-time-zone-option', 'isSelected:selected'],

  description: Ember.computed.oneWay('option.description'),
  option: null,
  selectedOption: null,

  isSelected: Ember.computed(
    'selectedOption.value',
    'option.value', function() {
      return this.get('selectedOption.value') === this.get('option.value');
  }),

  _selectOption: Ember.on('click', function() {
    this.attrs.onSelect(this.get('option.value'));
  })
});

import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':as-calendar-time-zone-option', 'isSelected:selected'],

  option: null,
  selectedOption: null,
  description: Ember.computed.oneWay('option.description'),

  isSelected: Ember.computed('selectedOption', 'option', function() {
    return this.get('selectedOption') === this.get('option');
  }),

  selectOption: Ember.on('click', function() {
    this.sendAction('onSelect', this.get('option'));
  })
});

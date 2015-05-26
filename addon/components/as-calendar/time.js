import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['style'],
  classNameBindings: [':as-calendar-time'],

  timeSlotHeight: null,

  style: Ember.computed('timeSlotHeight', function() {
    return `height: ${this.get('timeSlotHeight')}px`.htmlSafe();
  })
});

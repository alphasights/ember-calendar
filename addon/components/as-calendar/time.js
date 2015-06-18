import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['_style:style'],
  classNameBindings: [':as-calendar-time'],

  timeSlotHeight: null,

  _style: Ember.computed('timeSlotHeight', function() {
    return `height: ${this.get('timeSlotHeight')}px`.htmlSafe();
  })
});

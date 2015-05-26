import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['_style:style'],
  classNameBindings: [':as-calendar-occurrence'],
  tagName: 'section',

  occurrence: null,
  timeSlotDuration: null,
  timeSlotHeight: null,
  title: Ember.computed.oneWay('occurrence.title'),

  titleStyle: Ember.computed('timeSlotHeight', function() {
    return `line-height: ${this.get('timeSlotHeight')}px;`.htmlSafe();
  }),

  _duration: Ember.computed.oneWay('occurrence.duration'),

  _occupiedTimeSlots: Ember.computed(
    '_duration',
    'timeSlotDuration', function() {
      return this.get('_duration').as('ms') /
             this.get('timeSlotDuration').as('ms');
  }),

  _height: Ember.computed('_occupiedTimeSlots', function() {
    return this.get('timeSlotHeight') * this.get('_occupiedTimeSlots');
  }),

  _style: Ember.computed('_height', function() {
    return `top: 0;
            height: ${this.get('_height')}px;`.htmlSafe();
  })
});

import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['style'],
  classNameBindings: [':as-calendar-occurrence'],
  tagName: 'section',

  calendar: null,
  occurrence: null,
  timeSlotHeight: Ember.computed.oneWay('calendar.timeSlotHeight'),
  title: Ember.computed.oneWay('occurrence.title'),

  titleStyle: Ember.computed('timeSlotHeight', function() {
    return `line-height: ${this.get('timeSlotHeight')}px;`.htmlSafe();
  }),

  style: Ember.computed('timeSlotHeight', function() {
    return `top: 0;
            height: ${this.get('timeSlotHeight')}px;`.htmlSafe();
  })
});

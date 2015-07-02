import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  classNameBindings: [':as-calendar-timetable-content'],
  attributeBindings: ['_style:style'],

  days: Ember.computed.oneWay('model.days'),
  model: null,
  timeSlotDuration: Ember.computed.oneWay('model.timeSlotDuration'),
  timeSlots: Ember.computed.oneWay('model.timeSlots'),

  timeSlotStyle: Ember.computed('timeSlotHeight', function() {
    return `height: ${this.get('timeSlotHeight')}px`.htmlSafe();
  }),

  dayWidth: Ember.computed(function() {
    return this.$().width() / this.get('days.length');
  }).volatile(),

  handleMouseDown: Ember.on('mouseDown', function(event) {
    this.set('_mouseDownEvent', event);
  }),

  handleMouseUp: Ember.on('mouseUp', function(event) {
    var mouseDownEvent = this.get('_mouseDownEvent');

    if (event.pageX === mouseDownEvent.pageX &&
        event.pageY === mouseDownEvent.pageY &&
        Ember.$(event.target).closest('.as-calendar-occurrence').length == 0) {
      this.selectTime(event);
    }

    this.set('_mouseDownEvent', null);
  }),

  selectTime: function(event) {
    var offset = this.$().offset();
    var offsetX = event.pageX - offset.left;
    var offsetY = event.pageY - offset.top;
    var dayIndex = Math.floor(offsetX / this.get('dayWidth'));
    var timeSlotIndex = Math.floor(offsetY / this.get('timeSlotHeight'));
    var day = this.get('days').objectAt(dayIndex);
    var timeSlot = this.get('timeSlots').objectAt(timeSlotIndex);

    this.sendAction('onSelectTime',
      moment(day.get('value')).add(timeSlot.get('time')));
  },

  _mouseDownEvent: null,

  _style: Ember.computed(
  'timeSlotHeight',
  'timeSlots.length', function() {
    return (`height: ${this.get('timeSlots.length') *
                       this.get('timeSlotHeight')}px;`).htmlSafe();
  })
});

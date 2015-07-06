import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  classNameBindings: [':as-calendar-timetable-content'],
  attributeBindings: ['_style:style'],

  days: Ember.computed.oneWay('model.days'),
  model: null,
  timeSlotDuration: Ember.computed.oneWay('model.timeSlotDuration'),
  timeSlots: Ember.computed.oneWay('model.timeSlots'),
  timetable: null,

  timeSlotStyle: Ember.computed('timeSlotHeight', function() {
    return `height: ${this.get('timeSlotHeight')}px`.htmlSafe();
  }),

  dayWidth: Ember.computed(function() {
    if (this.get('_wasInserted')) {
      return this.$().width() / this.get('days.length');
    } else {
      return 0;
    }
  }).volatile(),

  _mouseDownEvent: null,
  _wasInserted: false,

  _style: Ember.computed(
  'timeSlotHeight',
  'timeSlots.length', function() {
    return (`height: ${this.get('timeSlots.length') *
                       this.get('timeSlotHeight')}px;`).htmlSafe();
  }),

  _setWasInserted: Ember.on('didInsertElement', function() {
    this.set('_wasInserted', true);
  }),

  _handleMouseDown: Ember.on('mouseDown', function(event) {
    this.set('_mouseDownEvent', event);
  }),

  _handleMouseUp: Ember.on('mouseUp', function(event) {
    var mouseDownEvent = this.get('_mouseDownEvent');

    if (event.pageX === mouseDownEvent.pageX &&
        event.pageY === mouseDownEvent.pageY &&
        Ember.$(event.target).closest('.as-calendar-occurrence').length === 0) {
      this._selectTime(event);
    }

    this.set('_mouseDownEvent', null);
  }),

  _registerWithParent: Ember.on('init', function() {
    this.set('timetable.contentComponent', this);
  }),

  _selectTime: function(event) {
    var offset = this.$().offset();
    var offsetX = event.pageX - Math.floor(offset.left);
    var offsetY = event.pageY - Math.floor(offset.top);
    var dayIndex = Math.floor(offsetX / this.get('dayWidth'));
    var timeSlotIndex = Math.floor(offsetY / this.get('timeSlotHeight'));
    var day = this.get('days').objectAt(dayIndex);
    var timeSlot = this.get('timeSlots').objectAt(timeSlotIndex);

    this.sendAction('onSelectTime',
      moment(day.get('value')).add(timeSlot.get('time')));
  },
});

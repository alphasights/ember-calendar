import Ember from 'ember';

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

  timeSlotWidth: Ember.computed(function() {
    return this.$().width() / this.get('days.length');
  }).volatile(),

  selectTime: Ember.on('click', function(event) {
    var offset = this.$().offset();
    var offsetX = event.pageX - offset.left;
    var offsetY = event.pageY - offset.top;
    var dayIndex = Math.floor(offsetX / this.get('timeSlotWidth'));
    var timeSlotIndex = Math.floor(offsetY / this.get('timeSlotHeight'));
    var day = this.get('days').objectAt(dayIndex);
    var timeSlot = this.get('timeSlots').objectAt(timeSlotIndex);

    this.sendAction('onSelectTime',
      moment(day.get('value')).add(timeSlot.get('time')));
  }),

  _style: Ember.computed(
  'timeSlotHeight',
  'timeSlots.length', function() {
    return (`height: ${this.get('timeSlots.length') *
                       this.get('timeSlotHeight')}px;`).htmlSafe();
  })
});

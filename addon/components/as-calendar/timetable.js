import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'section',
  classNameBindings: [':as-calendar-timetable'],

  days: Ember.computed.oneWay('model.days'),
  model: null,
  timeSlotHeight: null,
  timeSlots: Ember.computed.oneWay('model.timeSlots'),
  timeSlotDuration: Ember.computed.oneWay('model.timeSlotDuration'),
  
  labeledTimeSlots: Ember.computed('timeSlots.[]', function() {
    return this.get('timeSlots').filter(function(_, index) {
      return (index % 2) === 0;
    });
  }),

  timeSlotLabelListStyle: Ember.computed('timeSlotHeight', function() {
    var timeSlotHeight = this.get('timeSlotHeight');

    return (`margin-top: -${timeSlotHeight}px;
             line-height: ${timeSlotHeight * 2}px;`).htmlSafe();
  }),

  timeSlotLabelStyle: Ember.computed('timeSlotHeight', function() {
    return (`height: ${2 * this.get('timeSlotHeight')}px;`).htmlSafe();
  }),

  actions: {
    onChangeTimeZone: function() {
      this.sendAction('onChangeTimeZone', ...arguments);
    }
  }
});

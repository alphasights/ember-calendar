import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':as-calendar-timetable', 'model.isMonthView:as-calendar-timetable--month', 'model.isWeekView:as-calendar-timetable--week', 'model.isDayView:as-calendar-timetable--day'],
  tagName: 'section',

  days: Ember.computed.oneWay('model.days'),
  model: null,
  timeSlotHeight: null,
  timeSlots: Ember.computed.oneWay('model.timeSlots'),
  contentComponent: null,
  dayWidth: Ember.computed.oneWay('contentComponent.dayWidth'),
  referenceElement: Ember.computed.oneWay('contentComponent.element'),

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
    goTo: function (day) {
      if (this.attrs['onNavigateToDay']) {
        this.attrs['onNavigateToDay'](day);
      }
    }
  }
});

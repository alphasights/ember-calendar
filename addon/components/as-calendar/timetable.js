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

  timeSlotStyle: Ember.computed('timeSlotHeight', function() {
    return `height: ${this.get('timeSlotHeight')}px`.htmlSafe();
  }),

  contentStyle: Ember.computed(
  'timeSlotHeight',
  'timeSlots.length', function() {
    return (`height: ${this.get('timeSlots.length') *
                       this.get('timeSlotHeight')}px;`).htmlSafe();
  }),

  selectTime: Ember.on('click', function(event) {
    var $target = this.$(event.target);

    if ($target.parent().hasClass('days')) {
      var dayIndex = $target.index();
      var day = this.get('days').objectAt(dayIndex);

      var timeSlotIndex = Math.floor(event.offsetY / this.get('timeSlotHeight'));
      var timeSlotOffset = timeSlotIndex * this.get('timeSlotDuration').as('minutes');

      var time = moment(day.get('startingTime')).add(timeSlotOffset, 'minutes').toString();

      this.sendAction('onSelectTime', time);
    }
  }),

  actions: {
    changeTimeZone: function() {
      this.sendAction('onChangeTimeZone', ...arguments);
    }
  }
});


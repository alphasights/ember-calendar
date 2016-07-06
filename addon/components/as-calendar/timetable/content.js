import Ember from 'ember';
import moment from 'moment';
import computedDuration from 'ember-calendar/macros/computed-duration';

export default Ember.Component.extend({
  classNameBindings: [':as-calendar-timetable__content'],
  attributeBindings: ['_style:style'],

  days: Ember.computed.oneWay('model.days'),
  model: null,
  timeSlotDuration: Ember.computed.oneWay('model.timeSlotDuration'),
  timeSlots: Ember.computed.oneWay('model.timeSlots'),
  timetable: null,

  isTimerOn: true,

  _dayStartingTime: Ember.computed('model.dayStartingTime', function () {
    return this.get('model.dayStartingTime');
  }),
  _dayEndingTime: Ember.computed.oneWay('model.dayEndingTime'),
  nowTime: moment().format('H:mm'),
  computedNowTime: computedDuration('nowTime'),
  timeFromStartOfTheDay: Ember.computed('computedNowTime', '_dayStartingTime', function () {
    return this.get('computedNowTime').asMilliseconds() - this.get('_dayStartingTime').asMilliseconds();
  }),
  dayDuration: Ember.computed('_dayStartingTime', '_dayEndingTime', function () {
    return this.get('_dayEndingTime').asMilliseconds() - this.get('_dayStartingTime').asMilliseconds();
  }),

  timeSlotStyle: Ember.computed('timeSlotHeight', function () {
    return `height: ${this.get('timeSlotHeight')}px`.htmlSafe();
  }),

  dayWidth: Ember.computed(function () {
    if (this.get('_wasInserted')) {
      return this.$().width() / this.get('days.length');
    } else {
      return 0;
    }
  }).volatile(),

  _wasInserted: false,

  _style: Ember.computed(
    'timeSlotHeight',
    'timeSlots.length', function () {
      return (`height: ${this.get('model.isMonthView') ? '600px' : this.get('timeSlots.length') * this.get('timeSlotHeight')}px;`).htmlSafe();
    }),

  _setWasInserted: Ember.on('didInsertElement', function () {
    this.set('_wasInserted', true);
  }),

  _registerWithParent: Ember.on('init', function () {
    this.set('timetable.contentComponent', this);
  }),

  _selectTime: Ember.on('click', function (event) {
    var offset = this.$().offset();
    var offsetX = event.pageX - Math.floor(offset.left);
    var offsetY = event.pageY - Math.floor(offset.top);

    var dayIndex = Math.floor(offsetX / this.get('dayWidth'));
    var timeSlotIndex = Math.floor(offsetY / this.get('timeSlotHeight'));
    var day = this.get('days').objectAt(dayIndex);

    var timeSlot = this.get('timeSlots').objectAt(timeSlotIndex);

    this.attrs.onSelectTime(
      moment(day.get('value')).add(timeSlot.get('time'))
    );
  }),


  hourMarkerStyle: Ember.computed('timeFromStartOfTheDay', 'dayDuration', function () {
    const timeFromStartOfTheDay = this.get('timeFromStartOfTheDay');
    const dayDuration = this.get('dayDuration');

    let topPercentage = 0;
    let visibility = 'visible';

    if (timeFromStartOfTheDay && dayDuration) {
      topPercentage = (timeFromStartOfTheDay / dayDuration) * 100;
    } else {
      visibility = 'hidden';
    }

    return Ember.String.htmlSafe(`top: ${topPercentage}%; visibility: ${visibility}`);
  }),

  didInsertElement() {
    var that = this;
    this._super(...arguments);

    const timer = () => {
      Ember.run.later(function () {
        that.set('nowTime', moment().format('H:mm'));

        if (that.get('isTimerOn')) {
          timer();
        }
      }, 500);
    };

    timer();
  },
  willDestroyElement() {
    this._super(...arguments);
    this.set('isTimerOn', false);
  },

  actions: {
    goTo: function (day) {
      if (this.attrs['onNavigateToDay']) {
        this.attrs['onNavigateToDay'](day);
      }
    }
  }
});

import { htmlSafe } from '@ember/template';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import { later } from '@ember/runloop';
import { cancel } from '@ember/runloop';
import Component from '@ember/component';
import moment from 'moment';
import computedDuration from 'ember-calendar/macros/computed-duration';

export default Component.extend({
  classNameBindings: [':as-calendar-timetable', 'model.isMonthView:as-calendar-timetable--month', 'model.isWeekView:as-calendar-timetable--week', 'model.isDayView:as-calendar-timetable--day'],
  tagName: 'section',

  days: oneWay('model.days'),
  model: null,
  timeSlotHeight: null,
  timeSlots: oneWay('model.timeSlots'),
  contentComponent: null,
  dayWidth: oneWay('contentComponent.dayWidth'),
  referenceElement: oneWay('contentComponent.element'),

  isTimerOn: false,
  timeInterval: null,

  startOfWeek: moment().startOf('isoWeek').day(),

  _dayStartingTime: computed('model.{showAllHours,dayStartingTime}', function () {
    return this.get('model.showAllHours') ? moment.duration(0) : this.get('model.dayStartingTime');
  }),
  _dayEndingTime: computed('model.{showAllHours,dayEndingTime}', function () {
    return this.get('model.showAllHours') ? moment.duration(1, 'day') : this.get('model.dayEndingTime');
  }),
  now: moment(),
  currentDayNumber: computed('now', function () {
    const nowDayNumber = this.get('now').day();
    const startOfWeek = this.get('startOfWeek');

    return nowDayNumber === 0 ? startOfWeek : nowDayNumber - startOfWeek;
  }),
  nowTime: computed('now', function () {
    return this.get('now').format(this.get('nowTimeLabelFormat'));
  }),
  computedNowTime: computedDuration('nowTime'),
  timeFromStartOfTheDay: computed('computedNowTime', '_dayStartingTime', function () {
    return this.get('computedNowTime').asMilliseconds() - this.get('_dayStartingTime').asMilliseconds();
  }),
  dayDuration: computed('_dayStartingTime', '_dayEndingTime', function () {
    return this.get('_dayEndingTime').asMilliseconds() - this.get('_dayStartingTime').asMilliseconds();
  }),

  hourMarkerStyle: computed('timeFromStartOfTheDay', 'dayDuration', function () {
    const timeFromStartOfTheDay = this.get('timeFromStartOfTheDay');
    const dayDuration = this.get('dayDuration');

    let topPercentage = 0;
    let visibility = 'visible';

    if (timeFromStartOfTheDay && dayDuration) {
      topPercentage = (timeFromStartOfTheDay / dayDuration) * 100;
    } else {
      visibility = 'hidden';
    }

    return htmlSafe(`top: ${topPercentage}%; visibility: ${visibility}`);
  }),

  labeledTimeSlots: computed('timeSlots.[]', 'now', function () {
    const now = this.get('now');
    const startOfDay = moment().startOf('day');

    return this.get('timeSlots')
      .filter(function (_, index) {
        return (index % 2) === 0;
      })
      .map((timeSlot) => {
        const value = startOfDay.clone().add(timeSlot.get('time').valueOf(), 'milliseconds');
        const diff = now.diff(value);
        const ONE_HOUR = 60 * 60 * 1000;

        return {
          label: value.format(this.get('timeSlotLabelFormat')),
          isHidden: diff > 0 && diff < ONE_HOUR // hide label if its close to the now time marker
        };
      });
  }),

  timeSlotLabelListStyle: computed('timeSlotHeight', function() {
    var timeSlotHeight = this.get('timeSlotHeight');

    return htmlSafe(`margin-top: -${timeSlotHeight / 2}px; line-height: ${timeSlotHeight * 2}px;`);
  }),

  timeSlotLabelStyle: computed('timeSlotHeight', function() {
    return htmlSafe(`height: ${2 * this.get('timeSlotHeight')}px;`);
  }),

  init() {
    this._super(...arguments);

    const that = this;
    const timer = () => {
      if (!that.get('isTimerOn')) {
        return false;
      }

      that._timerId = later(function () {
        that.set('now', moment());
        timer();
      }, 60 * 1000);
    };

    this.set('isTimerOn', true);
    timer();
  },
  willDestroyElement() {
    this._super(...arguments);
    this.set('isTimerOn', false);
    if (this._timerId) {
      cancel(this._timerId);
    }
  },

  actions: {
    goTo: function (day) {
      if (this.get('onNavigateToDay')) {
        this.get('onNavigateToDay')(day);
      }
    }
  }
});

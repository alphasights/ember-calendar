import { merge } from '@ember/polyfills';
import EmberObject, { computed } from '@ember/object';
import range from '../utils/range';
import moment from 'moment';
import TimeSlot from './time-slot';
import Day from './day';
import OccurrenceProxy from './occurrence-proxy';

const indexTypesMap = {
  day: 'days',
  week: 'weeks',
  month: 'months',
};
const isoTypesMap = {
  day: 'Day',
  week: 'isoWeek',
  month: 'Month',
};

export default EmberObject.extend({
  dayEndingTime: null,
  dayStartingTime: null,
  occurrences: null,
  startingDate: null,
  startFromDate: false,
  timeSlotDuration: null,
  occurrencePreview: null,
  type: 'week',
  showAllHours: true,

  indexType: computed('type', function () {
    return indexTypesMap[this.get('type')];
  }),

  isoType: computed('type', function () {
    return isoTypesMap[this.get('type')];
  }),

  isInCurrentPeriod: computed('period', '_currentPeriod', function () {
    return this.get('period').isSame(this.get('_currentPeriod'));
  }),

  hasTimeSlots: computed('type', function () {
    return this.get('type') !== 'month';
  }),

  isMonthView: computed('type', function () {
    return this.get('type') === 'month';
  }),

  isWeekView: computed('type', function () {
    return this.get('type') === 'week';
  }),

  isDayView: computed('type', function () {
    return this.get('type') === 'day';
  }),

  timeSlots: computed(
    'dayStartingTime',
    'dayEndingTime',
    'timeSlotDuration',
    'showAllHours', function () {
      return TimeSlot.buildDay({
        timeZone: this.get('timeZone'),
        startingTime: this.get('dayStartingTime'),
        endingTime: this.get('dayEndingTime'),
        duration: this.get('timeSlotDuration'),
        showAllHours: this.get('showAllHours')
      });
    }),

  days: computed('type', 'period', function () {
    var res = null;
    switch (this.get('type')) {
    case 'day':
      res = Day.buildDay({ calendar: this });
      break;
    case 'week':
      res = Day.buildWeek({ calendar: this });
      break;
    case 'month':
      res = Day.buildMonth({ calendar: this });
      break;

    default:
      break;
    }
    return res;
  }),

  startDate: computed('startingTime', 'isoType', function () {
    return moment(this.get('startingTime')).startOf(this.get('isoType'));
  }),

  endDate: computed('startingTime', 'isoType', function () {
    return moment(this.get('startingTime')).endOf(this.get('isoType'));
  }),

  period: computed('startingTime', 'timeZone', 'isoType', function () {
    return moment(this.get('startingTime')).startOf(this.get('isoType'));
  }),

  _currentPeriod: computed('timeZone', 'isoType', function () {
    return moment().startOf(this.get('isoType'));
  }),

  init() {
    this._super(...arguments);
    if (this.get('startingTime') == null) {
      this.goToToday();
    }
    if (!this.get('dayNames') || !this.get('dayNames').length) {
      this.generateDayNames();
    }
    this.dayNames = [];
  },

  createOccurrence: function (options) {
    var content = merge({
      endsAt: moment(options.startsAt)
        .add(this.get('defaultOccurrenceDuration')).toDate(),

      title: this.get('defaultOccurrenceTitle'),
      type: this.get('defaultOccurrenceType')
    }, options);

    return OccurrenceProxy.create({
      calendar: this,
      content: EmberObject.create(content)
    });
  },

  changeType: function (type) {
    this.set('type', type);
  },

  navigate(index) {
    const indexType = this.get('indexType');
    const isoType = this.get('isoType');
    const date = moment(this.get('startingTime')).add(index, indexType).startOf(isoType);

    if (!this.checkIfDateInPeriod(date)) {
      this.set('startingTime', date);
    }
  },
  navigatePrevious: function () {
    this.navigate(-1);
  },
  navigateNext: function () {
    this.navigate(1);
  },

  goToDay: function (day) {
    this.set('startingTime', moment(day).startOf('day'));
  },
  goToDayView: function (day) {
    this.setProperties({
      startingTime: moment(day).startOf('day'),
      type: 'day'
    });
  },

  goToToday: function () {
    this.set('startingTime', moment().startOf('day'));
  },

  setStartTimeBasedOnType: function (type) {
    this.set('startingTime', moment(this.get('startingTime')).startOf(isoTypesMap[type]));
  },

  generateDayNames: function () {
    const date = moment().day(1);
    this.set('dayNames', range(0, 7).map(() => {
      const name = date.format(this.get('component.dateFormatOptions.monthContent'));
      date.add(1, 'days');
      return name;
    }));
  },

  checkIfDateInPeriod: function (date) {
    return this.get('period').isSame(moment(date).startOf(this.get('isoType')));
  }
});

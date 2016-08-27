import moment from 'moment';
import range from '../utils/range';
import Ember from 'ember';

var Day = Ember.Object.extend({
  calendar: null,
  offset: 0,
  isInPeriod: true,
  shortListLimit: 2,

  value: Ember.computed('_period', 'offset', function () {
    return moment(this.get('_period')).clone().add(this.get('offset'), 'day');
  }),

  occurrences: Ember.computed(
    'calendar.occurrences.@each.startingTime',
    'startingTime',
    'endingTime', function () {
      return this.get('calendar.occurrences').filter((occurrence) => {
        var startingTime = occurrence.get('startingTime');

        return startingTime >= this.get('startingTime') &&
          startingTime <= this.get('endingTime');
      });
    }),

  shortOccurencesList: Ember.computed('occurrences', function () { // get first 3 occurences for month view
    return this.get('occurrences').slice(0, this.get('shortListLimit'));
  }),

  showMoreCount: Ember.computed('occurrences', function () { // get first 3 occurences for month view
    const length = this.get('occurrences.length');
    const limit = this.get('shortListLimit');
    return length > limit ? length - limit : 0;
  }),

  hasShowMore: Ember.computed('showMoreCount', function () { // get first 3 occurences for month view
    return !!this.get('showMoreCount');
  }),

  occurrencePreview: Ember.computed(
    'calendar.occurrencePreview.startingTime',
    'startingTime',
    'endingTime', function() {
    var occurrencePreview = this.get('calendar.occurrencePreview');

    if (occurrencePreview != null) {
      var startingTime = occurrencePreview.get('startingTime');

      if (startingTime >= this.get('startingTime') &&
          startingTime <= this.get('endingTime')) {
        return occurrencePreview;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }),

  startingTime: Ember.computed(
    'value',
    '_timeSlots.firstObject.time', function () {
    return moment(this.get('value')).clone().startOf('day')
      .add(this.get('_timeSlots.firstObject.time'));
  }),

  endingTime: Ember.computed(
    'value',
    '_timeSlots.lastObject.endingTime', function() {
    return moment(this.get('value')).clone().startOf('day')
      .add(this.get('_timeSlots.lastObject.endingTime'));
  }),

  isToday: Ember.computed('value', function() {
    return this.get('value').isSame(moment(), 'day');
  }),

  isOutOfPeriod: Ember.computed('isInPeriod', function() {
    return !this.get('isInPeriod');
  }),

  _period: Ember.computed.oneWay('calendar.period'),
  _timeSlots: Ember.computed.oneWay('calendar.timeSlots')
});

Day.reopenClass({
  buildWeek: function(options) {
    return Ember.A(range(0, 7).map(function(dayOffset) {
      return Day.create({
        calendar: options.calendar,
        offset: dayOffset
      });
    }));
  },
  buildDay: function(options) {
    return Ember.A([Day.create({
      calendar: options.calendar,
      offset: 0
    })
    ]);
  },
  buildMonth: function (options) {
    const maxDaysNumber = 42;
    const calendarStartDate = options.calendar.get('startDate');
    const firstDate = calendarStartDate.isAfter(calendarStartDate.clone().startOf('isoWeek')) ?
                calendarStartDate.clone().startOf('isoWeek') :
      calendarStartDate.clone().startOf('isoWeek').subtract(7, "days");
    const firstDateDifference = firstDate.date() - firstDate.daysInMonth() - 1;

    return Ember.A(range(firstDateDifference, maxDaysNumber + firstDateDifference).map(function(dayOffset) {
      return Day.create({
        calendar: options.calendar,
        offset: dayOffset,
        isInPeriod: (dayOffset >= 0) && (dayOffset < (calendarStartDate.daysInMonth()))
      });
    }));
  }
});

export default Day;

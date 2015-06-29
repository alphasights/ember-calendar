import _ from 'lodash';
import moment from 'moment';
import Ember from 'ember';

var Day = Ember.Object.extend({
  calendar: null,
  offset: 0,

  value: Ember.computed('_week', 'offset', function() {
    return moment(this.get('_week')).add(this.get('offset'), 'day');
  }),

  occurrences: Ember.computed(
    'calendar.occurrences.@each.startingTime',
    'startingTime',
    'endingTime', function() {
    return this.get('calendar.occurrences').filter((occurrence) => {
      var startingDate = occurrence.get('startingTime').toDate();

      return startingDate >= this.get('startingTime').toDate() &&
             startingDate <= this.get('endingTime').toDate();
    });
  }),

  startingTime: Ember.computed(
    'value',
    '_timeSlots.firstObject.time', function() {
    return moment(this.get('value'))
      .add(this.get('_timeSlots.firstObject.time'));
  }),

  endingTime: Ember.computed(
    'value',
    '_timeSlots.lastObject.time', function() {
    return moment(this.get('value'))
      .add(this.get('_timeSlots.lastObject.time'));
  }),

  _week: Ember.computed.oneWay('calendar.week'),
  _timeSlots: Ember.computed.oneWay('calendar.timeSlots')
});

Day.reopenClass({
  buildWeek: function(options) {
    return Ember.A(_.range(0, 7).map(function(dayOffset) {
      return Day.create({
        calendar: options.calendar,
        offset: dayOffset
      });
    }));
  }
});

export default Day;

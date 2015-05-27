import _ from 'lodash';
import moment from 'moment';
import Ember from 'ember';

var Day = Ember.Object.extend({
  calendar: null,
  offset: 0,
  isSelected: false,

  value: Ember.computed('_week', 'offset', function() {
    return moment(this.get('_week')).add(this.get('offset'), 'day');
  }),

  occurrences: Ember.computed(
    'calendar.occurrences.@each.startingTime', function() {
    return this.get('calendar.occurrences').filter((occurrence) => {
      var startingDate = occurrence.get('startingTime').toDate();

      var nextDay = Day.create({
        calendar: this.get('calendar'),
        offset: this.get('offset') + 1
      });

      return startingDate >= this.get('value').toDate() &&
             startingDate <= nextDay.get('value').toDate();
    }).map((occurrence) => {
      return Ember.ObjectProxy.create({
        content: occurrence,
        day: this
      });
    });
  }),

  startingTime: Ember.computed(
    'value',
    '_timeSlots.firstObject.time', function() {
    return moment(this.get('value'))
      .add(this.get('_timeSlots.firstObject.time'));
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

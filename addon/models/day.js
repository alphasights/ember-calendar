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

  occurrences: Ember.computed('calendar.occurrences', function() {
    return this.get('calendar.occurrences');
  }),

  _week: Ember.computed.oneWay('calendar.week')
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

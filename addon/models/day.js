import moment from 'moment';
import Ember from 'ember';

var Day = Ember.Object.extend({
  calendar: null,
  offset: 0,
  week: Ember.computed.oneWay('calendar.week'),

  value: Ember.computed('week', 'offset', function() {
    return moment(this.get('week')).add(this.get('offset'), 'day');
  })
});

Day.reopenClass({
  buildWeek: function(options) {
    return Ember.A(_.range(0, 6).map(function(dayOffset) {
      return Day.create({
        calendar: options.calendar,
        offset: dayOffset
      });
    }));
  }
})

export default Day;

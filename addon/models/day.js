import moment from 'moment';
import Ember from 'ember';

export default Ember.Object.extend({
  calendar: null,
  offset: 0,
  week: Ember.computed.oneWay('calendar.week'),

  value: Ember.computed('week', 'offset', function() {
    return moment(this.get('week')).add(this.get('offset'), 'day');
  })
});

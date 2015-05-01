import moment from 'moment';
import Ember from 'ember';

export default Ember.Object.extend({
  title: null,
  value: null,

  abbreviation: Ember.computed('value', function() {
    return moment().tz(this.get('value')).zoneAbbr();
  }),

  description: Ember.computed('title', 'value', function() {
    var humanizedTitle = this.get('title').replace('_', ' ');

    if (this.get('value') != null) {
      return `${humanizedTitle} (${moment().tz(this.get('value')).format('Z z')})`;
    } else {
      return humanizedTitle;
    }
  })
});

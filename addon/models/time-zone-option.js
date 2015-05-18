import moment from 'moment';
import Ember from 'ember';

export default Ember.Object.extend({
  value: null,

  title: Ember.computed('value', function() {
    return this.get('value').replace('_', ' ');
  }),

  abbreviation: Ember.computed('value', function() {
    return moment().tz(this.get('value')).zoneAbbr();
  }),

  description: Ember.computed('value', function() {
    return `${this.get('title')} (${this.get('abbreviation')})`;
  })
});

import moment from 'moment';
import Ember from 'ember';

export default Ember.Object.extend({
  value: null,

  description: Ember.computed('value', function() {
    return `${this.get('_title')}
            (${this.get('_offset')}
            ${this.get('abbreviation')})`;
  }),

  abbreviation: Ember.computed('value', function() {
    return moment().tz(this.get('value')).format('z');
  }),

  _title: Ember.computed('value', function() {
    return this.get('value').replace('_', ' ');
  }),

  _offset: Ember.computed('value', function() {
    return moment().tz(this.get('value')).format('Z');
  })
});

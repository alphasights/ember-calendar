import moment from 'moment';
import Ember from 'ember';
import Time from './time';

export default Time.extend({
  offset: 0,
  localStartingDate: Ember.computed.oneWay('calendar.localStartingDate'),
  selections: Ember.computed.oneWay('calendar.selections'),

  value: Ember.computed('localStartingDate', 'offset', function() {
    return moment(this.get('localStartingDate')).add(this.get('offset'), 'day');
  }),

  serializedValue: Ember.computed('value', function() {
    return moment(this.get('value')).format('YYYY,M,D');
  }),

  selection: Ember.computed('selections.@each.day', 'serializedValue', function() {
    return this.get('selections').find((selection) => {
      return selection.get('day') === this.get('serializedValue');
    });
  }),

  isSelected: Ember.computed('selection', function() {
    return this.get('selection') != null;
  })
});

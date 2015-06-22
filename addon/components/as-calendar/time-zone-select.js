import moment from 'moment';
import Ember from 'ember';
import TimeZoneOption from 'ember-calendar/models/time-zone-option';

export default Ember.Component.extend({
  classNameBindings: [':as-calendar-time-zone-select'],
  tagName: 'section',

  defaultRegexp: null,
  showResults: false,
  query: '',
  value: null,

  selectedOptionAbbreviation: Ember.computed.oneWay(
    'selectedOption.abbreviation'
  ),

  arrangedOptions: Ember.computed('_options.[]', 'query', function() {
    var query = this.get('query');
    var regexp;

    if (query.length > 1) {
      regexp = new RegExp(query, 'i');
    } else {
      regexp = this.get('defaultRegexp');
    }

    return this.get('_options').filter((option) => {
      return option.get('description').match(regexp) ||
             option === this.get('selectedOption');
    });
  }),

  selectedOption: Ember.computed('value', '_options.@each.value', function() {
    return this.get('_options').findBy('value', this.get('value'));
  }),

  _options: Ember.computed(function() {
    return moment.tz.names().map(function(timeZoneName) {
      return TimeZoneOption.create({ value: timeZoneName });
    });
  }),

  actions: {
    onSelectOption: function(option) {
      this.sendAction('onChangeValue', option.get('value'));
    }
  }
});

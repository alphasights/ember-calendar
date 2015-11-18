import moment from 'moment';
import Ember from 'ember';
import TimeZoneOption from 'ember-calendar/models/time-zone-option';

export default Ember.Component.extend({
  classNameBindings: [':as-calendar-time-zone-select', 'showResults:open'],
  tagName: 'section',

  defaultQuery: '',
  showResults: false,
  inputQuery: '',
  query: '',
  value: null,
  options: null,
  showSearch: true,

  selectedOptionAbbreviation: Ember.computed.oneWay(
    'selectedOption.abbreviation'
  ),

  arrangedOptions: Ember.computed(
    '_options.@each.{description,value}',
    'selectedOption.value',
    'showSearch',
    '_query', function() {
    if (this.get('showSearch')) {
      var regexp = new RegExp(this.get('_query'), 'i');

      return this.get('_options').filter((option) => {
        return option.get('description').match(regexp) ||
               option.get('value') === this.get('selectedOption.value');
      });
    } else {
      return this.get('_options');
    }
  }),

  selectedOption: Ember.computed('value', function() {
    return TimeZoneOption.create({ value: this.get('value') });
  }),

  _query: Ember.computed('query', 'defaultQuery', function() {
    var query = this.get('query');

    if (Ember.isEmpty(query)) {
       return this.get('defaultQuery');
    } else {
      return query;
    }
  }),

  _options: Ember.computed('options', function() {
    if (Ember.isPresent(this.get('options'))) {
      return this.get('options');
    } else {
      return moment.tz.names().map(function(timeZoneName) {
        return TimeZoneOption.create({ value: timeZoneName });
      });
    }
  }),

  _setQuery: function (value) {
    this.set('query', value);
  },

  actions: {
    selectOption: function(option) {
      this.sendAction('onChangeValue', option.get('value'));
    },

    inputQueryChanged: function(value) {
      Ember.run.debounce(this, this._setQuery, value, 200);
    }
  }
});

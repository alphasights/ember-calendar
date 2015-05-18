import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':as-calendar-time-zone-select'],

  _timeZoneQuery: '',

  _timeZoneOptions: moment.tz.names().map(function(timeZoneName) {
    return TimeZoneOption.create({ value: timeZoneName });
  }),

  _arrangedTimeZoneOptions: Ember.computed('_timeZoneOptions.[]', '_timeZoneQuery', function() {
    var timeZoneQuery = this.get('_timeZoneQuery');
    var timeZoneRegexp;

    if (timeZoneQuery.length > 1) {
      timeZoneRegexp = new RegExp(timeZoneQuery, 'i');
    } else {
      timeZoneRegexp = this.get('defaultTimeZoneRegexp');
    }

    return this.get('_timeZoneOptions').filter((timeZoneOption) => {
      return timeZoneOption.get('description').match(timeZoneRegexp) ||
             timeZoneOption === this.get('_selectedTimeZoneOption');
    });
  }),

  _selectedTimeZoneOption: Ember.computed('timeZone', '_timeZoneOptions.@each.value', function() {
    return this.get('_timeZoneOptions').findBy('value', this.get('timeZone'));
  }),
});

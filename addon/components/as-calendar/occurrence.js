import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  tagName: 'article',
  classNameBindings: [':as-calendar-occurrence', 'type', 'selectionClass'],
  attributeBindings: ['style'],
  layoutName: 'components/as-calendar/occurrence',

  headerTemplateName: null,
  calendar: null,
  occurrence: null,
  timeSlotHeight: Ember.computed.oneWay('calendar.timeSlotHeight'),
  timeSlotDuration: Ember.computed.oneWay('calendar.timeSlotDuration'),
  timeZone: Ember.computed.oneWay('calendar.timeZone'),
  duration: Ember.computed.oneWay('occurrence.duration'),
  time: Ember.computed.oneWay('occurrence.time'),
  endingTime: Ember.computed.oneWay('occurrence.endingTime'),
  type: Ember.computed.oneWay('occurrence.type'),

  selectionClass: Ember.computed('calendar.selections.[]', 'occurrence', function() {
    if (this.get('calendar.selections').contains(this.get('occurrence'))) {
      return 'selection';
    } else {
      return null;
    }
  }),

  occupiedTimeSlots: Ember.computed('duration', function() {
    return this.get('duration').as('milliseconds') /
           this.get('timeSlotDuration').as('milliseconds');
  }),

  style: Ember.computed('timeSlotHeight', 'occupiedTimeSlots', function() {
    return (`height: ${this.get('occupiedTimeSlots') * this.get('timeSlotHeight')}px;`).htmlSafe();
  }),

  lineStyle: Ember.computed('timeSlotHeight', function() {
    return (`line-height: ${this.get('timeSlotHeight')}px;`).htmlSafe();
  }),

  timeInterval: Ember.computed('time', 'endingTime', 'timeZone', function() {
    var timeZone = this.get('timeZone');
    var includeAmPm = moment(this.get('time')).tz(timeZone).format('a') !== moment(this.get('endingTime')).tz(timeZone).format('a');
    var formattedTime = this.formattedTime(this.get('time'), timeZone, includeAmPm);
    var formattedEndingTime = this.formattedTime(this.get('endingTime'), timeZone);

    return `${formattedTime} - ${formattedEndingTime}`;
  }),

  formattedTime: function(time, timeZone, includeAmPm = true) {
    var localTime = moment(time);

    if (timeZone != null) {
      localTime = localTime.tz(timeZone);
    }

    var format;

    if (localTime.format('mm') === '00') {
      format = 'h';
    } else {
      format = 'h:mm';
    }

    if (includeAmPm) {
      format = format + 'a';
    }

    return localTime.format(format);
  }
});

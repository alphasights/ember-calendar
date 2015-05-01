import moment from 'moment';
import Ember from 'ember';
import TimeSlot from '../models/time-slot';
import Day from '../models/day';
import TimeZoneOption from '../models/time-zone-option';
import _ from 'lodash';

var startOfCurrentWeek = moment().startOf('week');

export default Ember.Component.extend({
  tagName: 'section',
  classNameBindings: [':calendar'],

  defaultSelectionDuration: moment.duration(60, 'minute'),
  defaultSelectionType: null,
  numberOfDays: 7,
  occurrences: [],
  selections: [],
  selection: null,
  startingDate: startOfCurrentWeek,
  timeSlotDuration: moment.duration(30, 'minute'),
  timeSlotHeight: 20,
  dayStartOffset: moment.duration('7:00'),
  dayEndOffset: moment.duration('22:00'),
  timeZone: null,
  title: '',
  timeZoneQuery: '',

  initializeDefaults: Ember.on('init', function() {
    if (this.get('timeZone') == null) {
      this.set('timeZone', 'UTC');
    }

    if (this.get('selections') == null) {
      this.set('selections', []);
    }

    if (this.get('occurrences') == null) {
      this.set('occurrences', []);
    }
  }),

  localTimeZoneOffset: Ember.computed('timeZone', 'startingDate', function() {
    var startingDate = this.get('startingDate');
    var timeZone = this.get('timeZone');
    var startingDateOffset = startingDate.toDate().getTimezoneOffset();
    var timeZoneOffset = -startingDateOffset;

    if (timeZone != null) {
      timeZoneOffset = -moment.tz.zone(timeZone).
                          offset(startingDate.toDate().getTime());
    }

    return timeZoneOffset + startingDateOffset;
  }),

  localStartingDate: Ember.computed('startingDate', 'localTimeZoneOffset', function() {
    return moment(this.get('startingDate'))
            .subtract(this.get('localTimeZoneOffset'), 'minutes');
  }),

  timeZoneOptions: Ember.computed(function() {
    return moment.tz.names().map(function(timeZoneName) {
      return TimeZoneOption.create({
        title: timeZoneName,
        value: timeZoneName
      });
    });
  }),

  selectedTimeZoneOption: Ember.computed('timeZone', 'timeZoneOptions.@each.value', function() {
    return this.get('timeZoneOptions').findBy('value', this.get('timeZone'));
  }),

  filteredTimeZoneOptions: Ember.computed('timeZoneOptions.[]', 'timeZoneQuery', function() {
    var query = this.get('timeZoneQuery');
    var regexp;

    if (query.length > 1) {
      regexp = new RegExp(query, 'i');
    } else {
      regexp = /New York|London|Dubai|Hong Kong/;
    }

    return this.get('timeZoneOptions').filter((timeZoneOption) => {
      return timeZoneOption.get('description').match(regexp) || timeZoneOption.get('value') === this.get('timeZone');
    });
  }),

  days: Ember.computed('numberOfDays', function() {
    return _.range(this.get('numberOfDays')).map((offset) => {
      return Day.create({
        offset: offset,
        calendar: this
      });
    });
  }),

  timeSlots: Ember.computed('dayStartOffset', 'dayEndOffset', 'timeSlotDuration', function() {
    return _.range(
      this.get('dayStartOffset').as('ms'),
      this.get('dayEndOffset').as('ms'),
      this.get('timeSlotDuration').as('ms')
    ).map((ms) => {
      return TimeSlot.create({
        offset: moment.duration(ms),
        calendar: this
      });
    });
  }),

  headerTimeSlots: Ember.computed('timeSlots.[]', function() {
    var timeSlots = this.get('timeSlots');

    return _.filter(timeSlots, function(timeSlot) {
      return (timeSlots.indexOf(timeSlot) % 2) === 0;
    });
  }),

  timeSlotsHeaderStyle: Ember.computed('timeSlotHeight', function() {
    var height = this.get('timeSlotHeight');

    return (`margin-top: -${height}px; line-height: ${height * 2}px`).htmlSafe();
  }),

  dayStyle: Ember.computed('days.length', function() {
    return (`width: ${100 / this.get('days.length')}%;`).htmlSafe();
  }),

  headerTimeSlotStyle: Ember.computed('timeSlotHeight', function() {
    return (`height: ${2 * this.get('timeSlotHeight')}px;`).htmlSafe();
  }),

  allOccurrences: Ember.computed('occurrences.[]', 'selections.[]', function() {
    return this.get('occurrences').concat(this.get('selections'));
  }),

  isValidSelection: function(selection, newProperties) {
    var newSelection = Ember.copy(selection);
    newSelection.setProperties(newProperties);

    var lastTimeSlotEndingTime =
      moment(newSelection.get('time'))
        .startOf('day')
        .add(this.get('timeSlots.lastObject.endingOffset'));

    return newSelection.get('duration').as('ms') >= this.get('timeSlotDuration').as('ms') &&
           newSelection.endsBefore(lastTimeSlotEndingTime) &&
           !newSelection.overlapsWith(_(this.get('allOccurrences')).without(selection));
  },

  addSelection: function(selection) {
    if (this.isValidSelection(selection)) {
      this.get('selections').pushObject(selection);
      this.sendAction('onAddSelection', selection);
    }
  },

  removeSelections: function(collection) {
    collection.forEach((selection) => {
      this.removeSelection(selection);
    });
  },

  removeSelection: function(selection) {
    this.get('selections').removeObject(selection);
    this.sendAction('onRemoveSelection', selection);
  },

  isShowingCurrentWeek: Ember.computed('startingDate', function() {
    return moment(this.get('startingDate'))
      .startOf('week').isSame(startOfCurrentWeek);
  }),

  onSearchClick: function(event) {
    event.stopPropagation();
  },

  actions: {
    navigateWeek: function(index) {
      this.set('startingDate', moment(this.get('startingDate')).add(index, 'week'));
    },

    goToCurrentWeek: function() {
      this.set('startingDate', startOfCurrentWeek);
    },

    onDayToggleSelection: function(params) {
      this.sendAction('onDayToggleSelection', params);
    }
  }
});

import jstz from 'jstz';
import Ember from 'ember';
import ComponentCalendar from 'ember-calendar/models/component-calendar';
import InboundActionsMixin from 'ember-component-inbound-actions/inbound-actions';

export default Ember.Component.extend(InboundActionsMixin, {
  classNameBindings: [':as-calendar'],
  tagName: 'section',

  dayEndingTime: '22:00',
  dayStartingTime: '8:00',
  defaultOccurrenceDuration: '1:00',
  defaultOccurrenceTitle: 'New event',
  defaultTimeZoneQuery: '',
  isEditing: true,
  model: null,
  occurrences: null,
  showHeader: true,
  showTimeZoneSearch: true,
  startingDate: null,
  timeSlotDuration: '00:30',
  timeSlotHeight: 20,
  monthTimeSlotHeight: 10,
  timeZone: jstz.determine().name(),
  title: null,
  type: 'week',

  _initializeModel: Ember.on('init', function() {
    this.set('model', ComponentCalendar.create({ component: this }));
  }),

  actions: {
    changeTimeZone: function(timeZone) {
      this.set('timeZone', timeZone);
    },

    addOccurrence: function (time) {
      if (this.get('model.isMonthView')) { console.log('asdsd'); return false; }

      var occurrence = this.get('model').createOccurrence({
        startsAt: time.toDate()
      });

      this.attrs['onAddOccurrence'](occurrence.get('content'));
    },

    onNavigate: function(index) {
      if (this.attrs['onNavigate']) {
        this.attrs['onNavigate'](index);
      }
    },

    navigateToDay: function (day) {
      this.get('model').goToDayView(day);
    },

    changeType: function (type) {
      this.get('model').changeType(type);

      if (this.attrs['onTypeChange']) {
        this.attrs['onTypeChange'](type);
      }
    }
  }
});

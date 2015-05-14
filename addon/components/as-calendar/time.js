import interact from 'interact';
import Ember from 'ember';
import moment from 'moment';
import Occurrence from 'ember-calendar/models/occurrence';
import TimeOccurrence from 'ember-calendar/models/time/occurrence';

export default Ember.Component.extend({
  tagName: 'article',

  classNameBindings: [':as-calendar-time'],
  attributeBindings: ['style'],

  timeSlot: null,
  day: null,
  calendar: null,
  timeSlotHeight: Ember.computed.oneWay('calendar.timeSlotHeight'),
  selectionType: Ember.computed.oneWay('calendar.defaultSelectionType'),
  selectionDuration: Ember.computed.oneWay('calendar.defaultSelectionDuration'),
  allOccurrences: Ember.computed.oneWay('calendar.allOccurrences'),

  componentFromElement: function(element) {
    return Ember.View.views[Ember.$(element).prop('id')];
  },

  dragEnter: function(event) {
    this.componentFromElement(event.relatedTarget).timeDragEnter(this, event);
  },

  drop: function(event) {
    this.componentFromElement(event.relatedTarget).timeDrop(this, event);
  },

  setupInteractions: Ember.on('didInsertElement', function() {
    interact(this.$()[0])
      .dropzone({})
      .on('dragenter', (event) => {
        Ember.run(() => {
          this.dragEnter(event);
        });
      })
      .on('drop', (event) => {
        Ember.run(() => {
          this.drop(event);
        });
      });
  }),

  disableInteractions: Ember.on('willDestroyElement', function() {
    interact(this.$()[0]).off();
  }),

  click: function() {
    this.get('calendar').addSelection(Occurrence.create({
      type: this.get('selectionType'),
      duration: this.get('selectionDuration'),
      time: this.get('time')
    }));
  },

  style: Ember.computed('timeSlotHeight', function() {
    return (`height: ${this.get('timeSlotHeight')}px;`).htmlSafe();
  }),

  time: Ember.computed('day.value', 'timeSlot.offset', function() {
    return moment(this.get('day.value')).add(this.get('timeSlot.offset'));
  }),

  endingTime: Ember.computed('day.value', 'timeSlot.endingOffset', function() {
    return moment(this.get('day.value')).add(this.get('timeSlot.endingOffset'));
  }),

  occurrences: Ember.computed('time', 'endingTime', 'allOccurrences.@each.time', function() {
    var time = this.get('time').toDate();
    var endingTime = this.get('endingTime').toDate();

    return this.get('allOccurrences').filter((occurrence) => {
      var occurrenceTime = occurrence.get('time').toDate();
      return occurrenceTime >= time && occurrenceTime < endingTime;
    }).map((occurrence) => {
      return TimeOccurrence.create({ time: this, occurrence: occurrence });
    });
  })
});

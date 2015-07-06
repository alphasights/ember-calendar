import Ember from 'ember';
import moment from 'moment';
import interact from 'interact';
import OccurrenceComponent from '../occurrence';

export default OccurrenceComponent.extend({
  classNameBindings: [':as-calendar-timetable-occurrence'],

  timetable: null,
  dayWidth: Ember.computed.oneWay('timetable.dayWidth'),
  referenceElement: Ember.computed.oneWay('timetable.referenceElement'),
  occurrenceTemplateName: 'components/as-calendar/timetable/occurrence',

  setupInteractions: Ember.on('didInsertElement', function() {
    interact(this.$()[0])
      .resizable({ edges: { bottom: '.resize-handle' } })
      .draggable({})
      .on('resizestart', (event) => {
        Ember.run(this, this.resizeStart, event);
      })
      .on('resizemove', (event) => {
        Ember.run(this, this.resizeMove, event);
      })
      .on('resizeend', (event) => {
        Ember.run(this, this.resizeEnd, event);
      })
      .on('dragstart', (event) => {
        Ember.run(this, this.dragStart, event);
      })
      .on('dragmove', (event) => {
        Ember.run(this, this.dragMove, event);
      })
      .on('dragend', (event) => {
        Ember.run(this, this.dragEnd, event);
      });
  }),

  resizeStart: function() {
    this.set('_calendar.occurrencePreview', this.get('model').copy());
  },

  resizeMove: function(event) {
    var newDuration = moment.duration(
      Math.floor(event.rect.height / this.get('timeSlotHeight')) *
      this.get('timeSlotDuration').as('ms')
    );

    var changes = {
      endsAt: moment(this.get('_startingTime')).add(newDuration).toDate()
    };

    if (this._validateChanges(changes)) {
      this.sendAction('onUpdate', this.get('_preview.content'), changes);
    }
  },

  resizeEnd: function() {
    this.sendAction('onUpdate', this.get('content'), {
      endsAt: this.get('_preview.content.endsAt')
    });

    this.set('_calendar.occurrencePreview', null);
  },

  dragStart: function() {
    var $this = this.$();
    var $referenceElement = Ember.$(this.get('referenceElement'));

    this.set('_calendar.occurrencePreview', this.get('model').copy());
    this.set('_dragDy', 0);
    this.set('_dragTopDistance', $referenceElement.offset().top - $this.offset().top);

    this.set('_dragBottomDistance',
             ($referenceElement.offset().top + $referenceElement.height()) -
             ($this.offset().top + $this.height()));
  },

  dragMove: function(event) {
    this.set('_dragDy', this.get('_dragDy') + event.dy);

    var offsetX = event.pageX - Ember.$(this.get('referenceElement')).offset().left;

    var verticalDrag = Math.min(
      Math.max(this.get('_dragDy'), this.get('_dragTopDistance')),
      this.get('_dragBottomDistance')
    );

    var verticalOffset = moment.duration(
      Math.floor(verticalDrag / this.get('timeSlotHeight')) * this.get('timeSlotDuration')
    );

    var horizontalOffset = moment.duration(
      Math.floor(offsetX / this.get('dayWidth')) -
      this.get('day.offset'),
      'days'
    );

    var startsAt = moment(this.get('_startingTime')).add(verticalOffset).add(horizontalOffset);

    var changes = {
      startsAt: startsAt.toDate(),
      endsAt: moment(startsAt).add(this.get('_duration')).toDate()
    };

    if (this._validateChanges(changes)) {
      this.sendAction('onUpdate', this.get('_preview.content'), changes);
    }
  },

  dragEnd: function() {
    this.sendAction('onUpdate', this.get('content'), {
      startsAt: this.get('_preview.content.startsAt'),
      endsAt: this.get('_preview.content.endsAt')
    });

    this.set('_calendar.occurrencePreview', null);
    this.set('_dragDy', null);
  },

  _dragDy: null,
  _calendar: Ember.computed.oneWay('model.calendar'),
  _dayEndingTime: Ember.computed.oneWay('day.endingTime'),
  _preview: Ember.computed.oneWay('_calendar.occurrencePreview'),

  _validateChanges: function(changes) {
    var newPreview = this.get('_preview').copy();

    newPreview.get('content').setProperties(changes);

    return newPreview.get('startingTime') >= newPreview.get('day.startingTime') &&
           newPreview.get('endingTime') <= newPreview.get('day.endingTime') &&
           newPreview.get('duration') >= this.get('timeSlotDuration');
  }
});

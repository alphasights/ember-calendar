import Ember from 'ember';
import moment from 'moment';
import interact from 'interact';

export default Ember.Component.extend({
  attributeBindings: ['_style:style'],
  classNameBindings: [':as-calendar-occurrence'],
  tagName: 'section',

  model: null,
  timeSlotDuration: null,
  timeSlotHeight: null,
  timetable: null,
  dayWidth: Ember.computed.oneWay('timetable.contentComponent.dayWidth'),
  referenceElement: Ember.computed.oneWay('timetable.contentComponent.element'),
  title: Ember.computed.oneWay('model.title'),
  content: Ember.computed.oneWay('model.content'),

  titleStyle: Ember.computed('timeSlotHeight', function() {
    return `line-height: ${this.get('timeSlotHeight')}px;`.htmlSafe();
  }),

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
      this.sendAction('onUpdateOccurrence', this.get('_preview.content'), changes);
    }
  },

  resizeEnd: function() {
    this.sendAction('onUpdateOccurrence', this.get('content'), {
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
      this.get('_day.offset'),
      'days'
    );

    var startsAt = moment(this.get('_startingTime')).add(verticalOffset).add(horizontalOffset);

    var changes = {
      startsAt: startsAt.toDate(),
      endsAt: moment(startsAt).add(this.get('_duration')).toDate()
    };

    if (this._validateChanges(changes)) {
      this.sendAction('onUpdateOccurrence', this.get('_preview.content'), changes);
    }
  },

  dragEnd: function() {
    this.sendAction('onUpdateOccurrence', this.get('content'), {
      startsAt: this.get('_preview.content.startsAt'),
      endsAt: this.get('_preview.content.endsAt')
    });

    this.set('_calendar.occurrencePreview', null);
    this.set('_dragDy', null);
  },

  _dragDy: null,
  _calendar: Ember.computed.oneWay('model.calendar'),
  _days: Ember.computed.oneWay('_calendar.days'),
  _duration: Ember.computed.oneWay('model.duration'),
  _startingTime: Ember.computed.oneWay('model.startingTime'),
  _day: Ember.computed.oneWay('model.day'),
  _dayStartingTime: Ember.computed.oneWay('_day.startingTime'),
  _dayEndingTime: Ember.computed.oneWay('_day.endingTime'),
  _preview: Ember.computed.oneWay('_calendar.occurrencePreview'),

  _occupiedTimeSlots: Ember.computed(
    '_duration',
    'timeSlotDuration', function() {
      return this.get('_duration').as('ms') /
             this.get('timeSlotDuration').as('ms');
  }),

  _height: Ember.computed('_occupiedTimeSlots', function() {
    return this.get('timeSlotHeight') * this.get('_occupiedTimeSlots');
  }),

  _top: Ember.computed(
    '_startingTime',
    '_dayStartingTime',
    'timeSlotDuration',
    'timeSlotHeight', function() {
    return (this.get('_startingTime').diff(this.get('_dayStartingTime')) /
            this.get('timeSlotDuration').as('ms')) *
            this.get('timeSlotHeight');
  }),

  _style: Ember.computed('_height', '_top', function() {
    return `top: ${this.get('_top')}px;
            height: ${this.get('_height')}px;`.htmlSafe();
  }),

  _validateChanges: function(changes) {
    var newPreview = this.get('_preview').copy();

    newPreview.get('content').setProperties(changes);

    return newPreview.get('startingTime') >= newPreview.get('day.startingTime') &&
           newPreview.get('endingTime') <= newPreview.get('day.endingTime') &&
           newPreview.get('duration') >= this.get('timeSlotDuration');
  }
});

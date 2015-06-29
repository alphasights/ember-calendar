import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  attributeBindings: ['_style:style'],
  classNameBindings: [':as-calendar-occurrence'],
  tagName: 'section',

  model: null,
  day: null,
  timeSlotDuration: null,
  timeSlotHeight: null,
  title: Ember.computed.oneWay('model.title'),
  content: Ember.computed.oneWay('model.content'),

  titleStyle: Ember.computed('timeSlotHeight', function() {
    return `line-height: ${this.get('timeSlotHeight')}px;`.htmlSafe();
  }),

  setupInteractions: Ember.on('didInsertElement', function() {
    interact(this.$()[0])
      .resizable({ edges: { bottom: '.resize-handle' } })
      .draggable({})
      .on('resizemove', (event) => {
        Ember.run(this, this.resizeMove, event);
      })
      .on('dragmove', (event) => {
        Ember.run(this, this.dragMove, event);
      })
      .on('dragstart', (event) => {
        Ember.run(this, this.dragStart, event);
      })
      .on('dragend', (event) => {
        Ember.run(this, this.dragEnd, event);
      });
  }),

  timeSlotWidth: Ember.computed(function() {
    return this.$().closest('.content').width() / this.get('_days.length');
  }).volatile(),

  resizeMove: function(event) {
    var newDuration = moment.duration(
      Math.floor(event.rect.height / this.get('timeSlotHeight')) *
      this.get('timeSlotDuration').as('ms')
    );

    var endsAt = moment(this.get('_startingTime')).add(newDuration);

    if (endsAt.toDate() <= this.get('_dayEndingTime').toDate() &&
        newDuration.as('ms') >= this.get('timeSlotDuration').as('ms')) {
      this.sendAction('onUpdateOccurrence', this.get('content'), {
        endsAt: endsAt.toDate()
      });
    }
  },

  dragMove: function(event) {
    this.set('_dragDy', this.get('_dragDy') + event.dy);
    this.set('_dragDx', this.get('_dragDx') + event.dx);

    var verticalOffset = moment.duration(
      Math.floor(this.get('_dragDy') / this.get('timeSlotHeight')) * this.get('timeSlotDuration')
    );

    var horizontalOffset = moment.duration(
      Math.floor(this.get('_dragDx') / this.get('timeSlotWidth')), 'days'
    );

    var startsAt = moment(this.get('_dragStartingTime')).add(verticalOffset).add(horizontalOffset);
    var endsAt = moment(startsAt).add(this.get('_duration'));

    if (true) {
      this.sendAction('onUpdateOccurrence', this.get('content'), {
        startsAt: startsAt.toDate(),
        endsAt: endsAt.toDate()
      });
    }
  },

  dragStart: function() {
    this.set('_dragDy', 0);
    this.set('_dragDx', 0);
    this.set('_dragStartingTime', this.get('_startingTime'));
  },

  dragEnd: function() {
    this.set('_dragDy', null);
    this.set('_dragDx', null);
    this.set('_dragStartingTime', null);
  },

  _dragDy: null,
  _dragDx: null,
  _days: Ember.computed.oneWay('model.calendar.days'),
  _duration: Ember.computed.oneWay('model.duration'),
  _startingTime: Ember.computed.oneWay('model.startingTime'),
  _dayStartingTime: Ember.computed.oneWay('day.startingTime'),
  _dayEndingTime: Ember.computed.oneWay('day.endingTime'),

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
  })
});

import $ from 'jquery';
import { run } from '@ember/runloop';
import { oneWay } from '@ember/object/computed';
import moment from 'moment';
import interact from 'interactjs';
import OccurrenceComponent from '../occurrence';

export default OccurrenceComponent.extend({
  classNameBindings: [':as-calendar-occurrence--timetable'],

  timetable: null,
  isInteracting: false,
  isDraggable: true,
  isResizable: true,
  isRemovable: true,
  dayWidth: oneWay('timetable.dayWidth'),
  referenceElement: oneWay('timetable.referenceElement'),
  isEditable: true,

  _calendar: oneWay('model.calendar'),
  _dayEndingTime: oneWay('day.endingTime'),
  _dragBottomDistance: null,
  _dragTopDistance: null,
  _dragVerticalOffset: null,
  _preview: oneWay('_calendar.occurrencePreview'),

  didInsertElement() {
    var interactable = interact(this.element).on('mouseup', (event) => {
      run(this, this._mouseUp, event);
    });

    if (this.get('isResizable')) {
      interactable.resizable({
        edges: { bottom: '.as-calendar-occurrence__resize-handle' },

        onstart: (event) => {
          run(this, this._resizeStart, event);
        },

        onmove: (event) => {
          run(this, this._resizeMove, event);
        },

        onend: (event) => {
          run(this, this._resizeEnd, event);
        },
      });
    }

    if (this.get('isDraggable')) {
      interactable.draggable({
        onstart: (event) => {
          run(this, this._dragStart, event);
        },

        onmove: (event) => {
          run(this, this._dragMove, event);
        },

        onend: (event) => {
          run(this, this._dragEnd, event);
        },
      });
    }

    if (this.get('onClick')) {
      interactable.on('tap', (event) => {
        if (event.double) { return; }
        run(this, this._tap, event);
      });
    }

    if (this.get('onDoubleClick')) {
      interactable.on('doubletap', (event) => {
        run(this, this._doubleTap, event);
      });
    }
  },

  willDestroyElement() {
    interact(this.$()[0]).off();
  },

  _resizeStart: function() {
    this.set('isInteracting', true);
    this.set('_calendar.occurrencePreview', this.get('model').copy());
  },

  _resizeMove: function(event) {
    var newDuration = moment.duration(
      Math.floor(event.rect.height / this.get('timeSlotHeight')) *
      this.get('computedTimeSlotDuration').as('ms')
    );

    var changes = {
      endsAt: moment(this.get('_startingTime')).add(newDuration).toDate()
    };

    this._validateAndSavePreview(changes);
  },

  _resizeEnd: function() {
    this.get('onUpdate')(this.get('content'), {
      endsAt: this.get('_preview.content.endsAt')
    });

    this.set('isInteracting', false);
    this.set('_calendar.occurrencePreview', null);
  },

  _dragStart: function() {
    var $this = this.element;
    var $referenceElement = this.get('referenceElement');
    const preview = this.get('model').copy();

    preview.set('isPreview', true);
    this.set('isInteracting', true);
    this.set('_calendar.occurrencePreview', preview);
    this.set('_dragVerticalOffset', 0);
    this.set('_dragTopDistance', $referenceElement.getBoundingClientRect().top - $this.getBoundingClientRect().top);

    this.set('_dragBottomDistance',
             ($referenceElement.getBoundingClientRect().top + $referenceElement.offsetHeight) -
      ($this.getBoundingClientRect().top + $this.offsetHeight));
  },

  _dragMove: function(event) {
    this.set('_dragVerticalOffset', this.get('_dragVerticalOffset') + event.dy);

    var dragTimeSlotOffset = this._dragTimeSlotOffset(event);
    var dragDayOffset = this._dragDayOffset(event);
    var startsAt = moment(this.get('_startingTime')).add(dragTimeSlotOffset).add(dragDayOffset);

    var changes = {
      startsAt: startsAt.toDate(),
      endsAt: moment(startsAt).add(this.get('_duration')).toDate()
    };

    this._validateAndSavePreview(changes);
  },

  _dragTimeSlotOffset: function() {
    var verticalDrag = this._clamp(
      this.get('_dragVerticalOffset'),
      this.get('_dragTopDistance'),
      this.get('_dragBottomDistance')
    );

    return moment.duration(
      Math.floor(verticalDrag / this.get('timeSlotHeight')) * this.get('computedTimeSlotDuration')
    );
  },

  _dragDayOffset: function(event) {
    var $referenceElement = $(this.get('referenceElement'));

    var offsetX = this._clamp(
      event.pageX - $referenceElement.offset().left,
      0,
      $referenceElement.width() - 1
    );

    return moment.duration(
      Math.floor(offsetX / this.get('dayWidth')) -
      this.get('day.offset'),
      'days'
    );
  },

  _dragEnd: function() {
    this.get('onUpdate')(this.get('content'), {
      startsAt: this.get('_preview.content.startsAt'),
      endsAt: this.get('_preview.content.endsAt')
    });

    this.set('isInteracting', false);
    this.set('_calendar.occurrencePreview', null);
    this.set('_dragVerticalOffset', null);
    this.set('_dragTopDistance', null);
    this.set('_dragBottomDistance', null);
  },

  _mouseUp: function() {
    document.documentElement.style.cursor = '';
  },

  _tap: function(event) {
    this.get('onClick')(this.get('content'));
    event.preventDefault();
  },

  _doubleTap: function(event) {
    this.get('onDoubleClick')(this.get('content'));
    event.preventDefault();
  },

  _validateAndSavePreview: function(changes) {
    if (this._validatePreviewChanges(changes)) {
      this.get('onUpdate')(this.get('_preview.content'), changes);
    }
  },

  _validatePreviewChanges: function(changes) {
    var newPreview = this.get('_preview').copy();

    newPreview.get('content').setProperties(changes);

    return newPreview.get('startingTime') >= newPreview.get('day.startingTime') &&
           newPreview.get('endingTime') <= newPreview.get('day.endingTime') &&
           newPreview.get('duration') >= this.get('computedTimeSlotDuration');
  },

  _clamp: function(number, min, max) {
    return Math.max(min, Math.min(number, max));
  },

  actions: {
    remove: function() {
      this.get('onRemove')(this.get('content'));
      this.set('isInteracting', false);
    },
    edit: function() {
      this.get('onEdit')(this.get('content'));
      this.set('isInteracting', false);
    }
  }
});

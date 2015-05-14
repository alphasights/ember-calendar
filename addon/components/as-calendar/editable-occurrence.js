import interact from 'interact';
import Ember from 'ember';
import moment from 'moment';
import OccurrenceComponent from './occurrence';
import TimeOccurrence from 'ember-calendar/models/time/occurrence';

export default OccurrenceComponent.extend({
  headerTemplateName: 'components/as-calendar/editable-occurrence/-header',
  classNameBindings: [':as-calendar-editable-occurrence', 'isResizing:resizing'],
  startingDragTime: null,
  lastRelativeTime: null,
  selections: Ember.computed.oneWay('calendar.selections'),
  isResizing: false,

  offset: Ember.computed(function() {
    var isVisible = this.$().is(':visible');

    if (!isVisible) {
      this.$().show();
    }

    var offset = this.$().offset();

    if (!isVisible) {
      this.$().hide();
    }

    return offset;
  }).volatile(),

  setupInteractions: Ember.on('didInsertElement', function() {
    interact(this.$()[0])
      .draggable({})
      .resizable({
        edges: {
          bottom: '.resize-handle'
        }
      })
      .on('resizestart', (event) => {
        Ember.run(() => {
          this.resizeStart(event);
        });
      })
      .on('resizemove', (event) => {
        Ember.run(() => {
          this.resizeMove(event);
        });
      })
      .on('resizeend', (event) => {
        Ember.run(() => {
          this.resizeEnd(event);
        });
      })
      .on('dragstart', (event) => {
        Ember.run(() => {
          this.dragStart(event);
        });
      });
  }),

  disableInteractions: Ember.on('willDestroyElement', function() {
    interact(this.$()[0]).off();
  }),

  componentFromElement: function(element) {
    return Ember.View.views[Ember.$(element).prop('id')];
  },

  relativeTimeOffsetFromEvent: function(component) {
    var timeGutter = component.$().outerHeight() - component.$().height();

    return {
      left: component.$().offset().left + timeGutter,

      top: this.get('offset').top + Math.floor(
        (component.get('timeSlot.offset').as('ms') -
        this.get('startingDragTime').get('timeSlot.offset').as('ms')) /
         this.get('timeSlotDuration').as('ms')
      ) * (this.get('timeSlotHeight') - timeGutter)
    };
  },

  relativeTimeFromEvent: function(component, event) {
    var lastRelativeTime = this.get('lastRelativeTime');
    var relativeTimeOffset = this.relativeTimeOffsetFromEvent(component, event);

    if (lastRelativeTime != null) {
      lastRelativeTime.$('.as-calendar-occurrence:last').hide();
    }

    var relativeTime = this.componentFromElement(Ember.$(document.elementFromPoint(
      relativeTimeOffset.left - Ember.$(window).scrollLeft(),
      relativeTimeOffset.top - Ember.$(window).scrollTop()
    )).closest('.calendar-time'));

    if (lastRelativeTime != null) {
      lastRelativeTime.$('.as-calendar-occurrence:last').show();
    }

    return relativeTime;
  },

  timeDragEnter: function(component, event) {
    var lastRelativeTime = this.get('lastRelativeTime');
    var startingDragTime = this.get('startingDragTime');

    if (startingDragTime == null) {
       startingDragTime = this.set('startingDragTime', component);
    }

    var relativeTime = this.relativeTimeFromEvent(component, event);

    var isValid = relativeTime == null ||
                  this.get('calendar').isValidSelection(this.get('occurrence'), {
                    time: relativeTime.get('time')
                  });

    if(isValid && relativeTime !== lastRelativeTime) {
      this.set('lastRelativeTime', relativeTime);

      if (lastRelativeTime != null) {
        Ember.run.schedule('afterRender', this, function() {
          lastRelativeTime.get('occurrences').popObject();
        });
      }

      if (relativeTime != null) {
        relativeTime.get('occurrences').pushObject(TimeOccurrence.create({
          occurrence: this.get('occurrence'),
          time: relativeTime
        }));
      }
    }
  },

  timeDrop: function() {
    this.get('occurrence').send('update', { time: this.get('lastRelativeTime.time') });
  },

  resizeStart: function() {
    this.set('isResizing', true);
  },

  resizeMove: function(event) {
    var newDuration = moment.duration(
      Math.floor(event.rect.height / this.get('timeSlotHeight')) *
      this.get('timeSlotDuration')
    );

    if (this.get('calendar').isValidSelection(this.get('occurrence'), {
      duration: newDuration
    })) {
      this.set('duration', newDuration);
    }
  },

  resizeEnd: function() {
    this.set('isResizing', false);
    this.get('occurrence').send('update', { duration: this.get('duration') });
  },

  dragStart: function() {
    Ember.run.schedule('afterRender', this, function() {
      this.$().hide();
    });
  },

  actions: {
    delete: function() {
      this.get('calendar').removeSelection(this.get('occurrence'));
    }
  }
});

import Ember from 'ember';
import moment from 'moment';
import interact from 'interact';

export default Ember.Component.extend({
  tagName: 'article',
  classNameBindings: [':as-calendar-occurrence', 'occurrence.type', 'type'],
  attributeBindings: ['style'],

  calendar: null,
  occurrence: null,
  startingDragTime: null,
  lastRelativeTime: null,
  timeSlotHeight: Ember.computed.oneWay('calendar.timeSlotHeight'),
  timeSlotDuration: Ember.computed.oneWay('calendar.timeSlotDuration'),
  timeZone: Ember.computed.oneWay('calendar.timeZone'),
  selections: Ember.computed.oneWay('calendar.selections'),
  duration: Ember.computed.oneWay('occurrence.duration'),
  time: Ember.computed.oneWay('occurrence.time'),
  endingTime: Ember.computed.oneWay('occurrence.endingTime'),

  type: Ember.computed('occurrence', 'selections.[]', function() {
    if (this.get('selections').contains(this.get('occurrence'))) {
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
    var formattedTime = this.formattedTime(this.get('time'), timeZone);
    var formattedEndingTime = this.formattedTime(this.get('endingTime'), timeZone);

    return `${formattedTime} - ${formattedEndingTime}`;
  }),

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

  formattedTime: function(time, timeZone) {
    var localTime = moment(time);

    if (timeZone != null) {
      localTime = localTime.tz(timeZone);
    }

    var format;

    if (localTime.format('mm') === '00') {
      format = 'ha';
    } else {
      format = 'h:mma';
    }

    return localTime.format(format);
  },

  setupInteractions: Ember.on('didInsertElement', function() {
    interact(this.$()[0])
      .draggable({})
      .resizable({
        edges: {
          bottom: '.resize-handle'
        }
      })
      .on('resizemove', (event) => {
        this.resizeMove(event);
      })
      .on('resizeend', (event) => {
        this.resizeEnd(event);
      })
      .on('dragstart', (event) => {
        this.dragStart(event);
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
    )).closest('.as-calendar-time'));

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
        relativeTime.get('occurrences').pushObject(this.get('occurrence'));
      }
    }
  },

  timeDrop: function() {
    this.set('occurrence.time', this.get('lastRelativeTime.time'));
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
    this.set('occurrence.duration', this.get('duration'));
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

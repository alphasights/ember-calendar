import Ember from 'ember';

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

  setupInteractions: function() {
    interact(this.$()[0])
      .resizable({
        edges: {
          bottom: '.resize-handle'
        }
      })
      .on('resizemove', (event) => {
        Ember.run(() => {
          this.resizeMove(event);
        });
      });
  }.on('didInsertElement'),

  resizeMove: function(event) {
    var newDuration = moment.duration(
      Math.floor(event.rect.height / this.get('timeSlotHeight')) *
      this.get('timeSlotDuration')
    );

    this.sendAction('onUpdateOccurrence', this.get('content'), {
      endsAt: moment(this.get('_startingTime')).add(newDuration).toDate()
    });
  },

  _duration: Ember.computed.oneWay('model.duration'),
  _startingTime: Ember.computed.oneWay('model.startingTime'),
  _dayStartingTime: Ember.computed.oneWay('day.startingTime'),

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

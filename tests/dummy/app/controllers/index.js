import Ember from 'ember';

export default Ember.Controller.extend({
  selections: [],

  occurrences: [Ember.Object.create({
    title: 'Some event',
    startsAt: moment().startOf('day').add(10, 'hours'),
    endsAt: moment().startOf('day').add(12, 'hours')
  })],

  actions: {
    onCalendarAddSelection: function() {

    },

    onCalendarRemoveSelection: function() {

    },

    onCalendarDayToggleSelection: function() {

    }
  }
});

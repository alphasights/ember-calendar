import Ember from 'ember';

export default Ember.Controller.extend({
  selections: Ember.A(),

  occurrences: Ember.A([Ember.Object.create({
    title: 'Some event',
    startsAt: moment().tz('UTC').startOf('day').add(10, 'hours').toDate(),
    endsAt: moment().tz('UTC').startOf('day').add(12, 'hours').toDate()
  })]),

  actions: {
    onCalendarAddSelection: function() {

    },

    onCalendarRemoveSelection: function() {

    },

    onCalendarDayToggleSelection: function() {

    }
  }
});

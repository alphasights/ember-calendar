import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({
  selections: Ember.A(),

  occurrences: Ember.A([Ember.Object.create({
    title: 'Some event',
    startsAt: moment().utc().startOf('day').add(10, 'hours').toDate(),
    endsAt: moment().utc().startOf('day').add(12, 'hours').toDate()
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

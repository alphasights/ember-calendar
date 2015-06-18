import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'header',
  classNameBindings: [':as-calendar-header'],

  isInCurrentWeek: Ember.computed.oneWay('model.isInCurrentWeek'),
  model: null,
  title: '',

  actions: {
    navigateWeek: function(index) {
      this.get('model').navigateWeek(index);
    },

    goToCurrentWeek: function() {
      this.get('model').goToCurrentWeek();
    }
  }
});

import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':as-calendar-header'],
  tagName: 'header',

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

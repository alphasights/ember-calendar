import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: [':as-calendar-header'],
  tagName: 'header',

  isInCurrentPeriod: Ember.computed.oneWay('model.isInCurrentPeriod'),
  model: null,
  title: '',

  actions: {
    navigateNext: function () {
      this.get('model').navigateNext();

      if (this.attrs['onNavigate']) {
        this.attrs['onNavigate'](1);
      }
    },
    navigatePrevious: function() {
      this.get('model').navigatePrevious();

      if (this.attrs['onNavigate']) {
        this.attrs['onNavigate'](-1);
      }
    },

    changeType: function (type) {
      if (this.attrs['onTypeChange']) {
        this.attrs['onTypeChange'](type);
      }
    },

    goToToday: function() {
      this.get('model').goToToday();
    }
  }
});

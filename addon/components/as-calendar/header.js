import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [':as-calendar-header'],
  tagName: 'header',

  isInCurrentWeek: oneWay('model.isInCurrentPeriod'),
  model: null,
  title: '',

  actions: {
    navigateNext: function () {
      this.get('model').navigateNext();

      if (this.get('onNavigate')) {
        this.get('onNavigate')({
          view: this.get('model.type'),
          start: this.get('model.startDate'),
          end: this.get('model.endDate'),
          dir: 1
        });
      }
    },
    navigatePrevious: function() {
      this.get('model').navigatePrevious();

      if (this.get('onNavigate')) {
        this.get('onNavigate')({
          view: this.get('model.type'),
          start: this.get('model.startDate'),
          end: this.get('model.endDate'),
          dir: -1
        });
      }
    },

    changeType: function (type) {
      if (this.get('onTypeChange')) {
        this.get('onTypeChange')(type);
      }
    },

    goToToday: function() {
      this.get('model').goToToday();
    }
  }
});

import moment from 'moment';
import Ember from 'ember';

export default Ember.Object.extend({
  calendar: null,
  duration: null,
  startingTime: null,
  title: '',

  endingTime: Ember.computed('startingTime', 'duration', function() {
    return moment(this.get('startingTime')).add(this.get('duration'));
  })
});

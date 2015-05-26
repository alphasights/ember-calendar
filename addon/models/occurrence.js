import Ember from 'ember';

export default Ember.Object.extend({
  calendar: null,
  content: null,
  startingTime: Ember.computed.oneWay('content.startsAt'),
  title: Ember.computed.oneWay('content.title'),
  
  duration: Ember.computed('startingTime', '_endingTime', function() {
    return moment.duration(
      moment(this.get('endingTime')).diff(this.get('startingTime'))
    );
  }),

  _endingTime: Ember.computed.oneWay('content.endsAt')
});

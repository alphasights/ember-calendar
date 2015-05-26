import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['style'],
  classNameBindings: [':as-calendar-occurrence'],
  tagName: 'section',

  occurrence: null,
  title: Ember.computed.oneWay('occurrence.title')
});

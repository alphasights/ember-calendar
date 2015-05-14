import Ember from 'ember';
import _ from 'lodash';

export default Ember.Object.extend({
  occurrence: null,
  time: null,
  calendar: Ember.computed.oneWay('time.calendar'),
  selections: Ember.computed.oneWay('calendar.selections'),
  disableInteractions: Ember.computed.oneWay('calendar.disableInteractions'),

  isEditable: Ember.computed('selections.[]', 'occurrence', 'disableInteractions', function() {
    var occurrence = this.get('occurrence');
    var selections = this.get('selections');

    return !this.get('disableInteractions') &&
           selections.contains(occurrence) &&
           !occurrence.overlapsWith(_(selections).without(occurrence));
  }),

  componentName: Ember.computed('isEditable', function() {
    if (this.get('isEditable')) {
      return 'as-calendar/editable-occurrence';
    } else {
      return 'as-calendar/occurrence';
    }
  })
});

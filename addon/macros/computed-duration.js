import moment from 'moment';
import Ember from 'ember';

export default function(dependentKey) {
  return Ember.computed(dependentKey, function() {
    var dependentValue = this.get(dependentKey);

    if (dependentValue != null) {
      return moment.duration(dependentValue);
    } else {
      return null;
    }
  });
}

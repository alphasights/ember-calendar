import moment from 'moment';
import Ember from 'ember';

export default function(dependentKey) {
  return Ember.computed(dependentKey, function(_, value) {
    if (arguments.length > 1) {
      if (value != null) {
        this.set(dependentKey, value.toDate());
      } else {
        this.set(dependentKey, null);
      }
    }

    var dependentValue = this.get(dependentKey);

    if (dependentValue != null) {
      return moment(dependentValue);
    } else {
      return null;
    }
  });
}

import moment from 'moment';
import Ember from 'ember';

const { computed } = Ember;

export default function(dependentKey, timeZoneKey) {
  return computed(dependentKey, timeZoneKey, {
    get() {
      var dependentValue = this.get(dependentKey);
      let timezone = this.get(timeZoneKey);

      if (dependentValue != null) {
        return moment(dependentValue).tz(timezone);
      } else {
        return null;
      }
    },

    set(_, value) {
      if (value != null) {
        this.set(dependentKey, value.toDate());
      } else {
        this.set(dependentKey, null);
      }

      return value;
    }
  });
}

import moment from 'moment';
import Ember from 'ember';

var Occurrence = Ember.Object.extend(Ember.Copyable, {
  duration: moment.duration(),
  title: null,
  time: null,

  endingTime: Ember.computed('time', 'duration', function() {
    return moment(this.get('time')).add(this.get('duration'));
  }),

  overlapsWith: function(occurrences) {
    var time = this.get('time').toDate();
    var endingTime = this.get('endingTime').toDate();

    return occurrences.any(function(occurrence) {
      var occurrenceTime = occurrence.get('time').toDate();
      var occurrenceEndingTime = occurrence.get('endingTime').toDate();

      return (endingTime > occurrenceTime && time < occurrenceEndingTime);
    });
  },

  endsBefore: function(date) {
    return this.get('endingTime').toDate() <= date.toDate();
  },

  isEqual: function(other) {
    return this.get('time').isSame(other.get('time')) &&
           this.get('endingTime').isSame(other.get('endingTime'));
  },

  copy: function() {
    return Occurrence.create({
      time: this.get('time'),
      title: this.get('title'),
      duration: this.get('duration')
    });
  }
});

export default Occurrence;

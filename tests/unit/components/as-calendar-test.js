import hbs from 'htmlbars-inline-precompile';
import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';
import moment from 'moment';
import { initialize as momentInitializer } from 'dummy/initializers/ember-moment';
var run = Ember.run;

momentInitializer();

moduleForComponent('as-calendar', 'AsCalendarComponent', { integration: true });

test('Add an occurrence', function(assert) {
  this.set('occurrences', []);
  this.set('calendarAddOccurrence', 'calendarAddOccurrence');

  this.render(hbs`
    {{as-calendar
      title="Ember Calendar"
      occurrences=occurrences
      dayStartingTime="9:00"
      dayEndingTime="18:00"
      timeSlotDuration="00:30"
      onAddOccurrence="calendarAddOccurrence"}}
  `);

  this.on('calendarAddOccurrence', function(occurrence) {
    debugger;
    this.get('occurrences').pushObject(occurrence);
  });

  run(() => {
    var e = new jQuery.Event("click");
    e.pageX = 10;
    e.pageY = 10;
    $('.as-calendar-timetable-content').trigger(e);
    debugger;
  });

  assert.equal(this.$('.as-calendar-occurrence').length, 1,
    'it adds the occurrence to the calendar'
  );
});

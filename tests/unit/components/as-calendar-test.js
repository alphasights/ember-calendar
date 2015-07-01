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

  assert.equal(this.$('.as-calendar-occurrence').length, 0);

  this.on('calendarAddOccurrence', (occurrence) => {
    this.get('occurrences').pushObject(occurrence);
  });

  run(() => {
    var $target = $('ul.days li:first');

    var mousedown = new $.Event("mousedown");
    mousedown.pageX = $target.offset().left;
    mousedown.pageY = $target.offset().top;
    $target.trigger(mousedown);

    var mouseup = new $.Event("mouseup");
    mouseup.pageX = $target.offset().left;
    mouseup.pageY = $target.offset().top;
    $target.trigger(mouseup);
  });

  assert.equal(this.$('.as-calendar-occurrence').length, 1,
    'it adds the occurrence to the calendar'
  );
});

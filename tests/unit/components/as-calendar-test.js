import hbs from 'htmlbars-inline-precompile';
import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';
import moment from 'moment';
import { initialize as momentInitializer } from 'dummy/initializers/ember-moment';

momentInitializer();

moduleForComponent('as-calendar', 'AsCalendarComponent', { integration: true });

var triggerAtPoint = function(target, name, point) {
  var event = new $.Event(name);

  event.pageX = point.x;
  event.pageY = point.y;

  target.trigger(event);
};

var selectTime = function(options) {
  Ember.run(() => {
    var $target = $('.as-calendar-timetable-content');
    var offsetX = options.day * ($target.find('.days > li:first').width());
    var offsetY = options.timeSlot * ($target.find('.time-slots > li:first').height());

    var point = {
      x: $target.offset().left + offsetX,
      y: $target.offset().top + offsetY
    };

    triggerAtPoint($target, 'mousedown', point);
    triggerAtPoint($target, 'mouseup', point);
  });
};

test('Add an occurrence', function(assert) {
  this.set('occurrences', Ember.A([Ember.Object.create({
    startsAt: moment().startOf('day').add(10, 'hours'),
    endsAt: moment().startOf('day').add(12, 'hours'),
    title: 'Awesome Event'
  })]));

  this.on('calendarAddOccurrence', (occurrence) => {
    this.get('occurrences').pushObject(occurrence);
  });

  this.render(hbs`
    {{as-calendar
      title="Ember Calendar"
      occurrences=occurrences
      dayStartingTime="9:00"
      dayEndingTime="18:00"
      timeSlotDuration="00:30"
      onAddOccurrence="calendarAddOccurrence"}}
  `);

  assert.equal(this.$('.as-calendar-occurrence').length, 1,
    'it shows an empty calendar'
  );

  selectTime({ day: 0, timeSlot: 0 });

  assert.equal(this.$('.as-calendar-occurrence').length, 2,
    'it adds the occurrence to the calendar'
  );
});

test('Resize an occurrence', function(assert) {
  assert.expect(0);
});

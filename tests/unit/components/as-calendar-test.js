import hbs from 'htmlbars-inline-precompile';
import { test, moduleForComponent } from 'ember-qunit';
import Ember from 'ember';
import moment from 'moment';
import { initialize as momentInitializer } from 'dummy/initializers/ember-moment';

momentInitializer();

moduleForComponent('as-calendar', 'AsCalendarComponent', { integration: true });

var timeSlotHeight = function() {
  return $('.as-calendar-timetable-content')
    .find('.time-slots > li:first')
    .height();
};

var dayWidth = function() {
  var $content = $('.as-calendar-timetable-content');
  return $content.width() / $content.find('.days > li').length;
};

var pointForTime = function(options) {
  var $target = $('.as-calendar-timetable-content');
  var offsetX = options.day * dayWidth();
  var offsetY = options.timeSlot * timeSlotHeight();

  return {
    clientX: $target.offset().left + offsetX - $(document).scrollLeft(),
    clientY: $target.offset().top + offsetY - $(document).scrollTop()
  };
};

var selectTime = function(options) {
  Ember.run(() => {
    var $target = $('.as-calendar-timetable-content');
    var point = pointForTime(options);

    $target.simulate('mousedown', point);
    $target.simulate('mouseup', point);
  });
};

var resizeOccurrence = function(occurrence, options) {
  Ember.run(() => {
    occurrence.find('.resize-handle').simulate('drag', {
      dx: 0,
      dy: options.timeSlots * timeSlotHeight()
    });
  });
};

var dragOccurrence = function(occurrence, options) {
  Ember.run(() => {
    occurrence.simulate('drag', {
      dx: options.days * dayWidth(),
      dy: options.timeSlots * timeSlotHeight()
    });
  });
};

var selectTimeZone = function(name) {
  Ember.run(() => {
    $('.as-calendar-time-zone-select .rl-dropdown-toggle').click();
  });

  Ember.run(() => {
    $(`.as-calendar-time-zone-option:contains('${name}')`).click();
  });
};

test('Add an occurrence', function(assert) {
  this.set('occurrences', Ember.A());

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

  assert.equal($('.as-calendar-occurrence').length, 0,
    'it shows an empty calendar'
  );

  selectTime({ day: 0, timeSlot: 0 });

  assert.equal($('.as-calendar-occurrence').length, 1,
    'it adds the occurrence to the calendar'
  );
});

test('Remove an occurrence', function(assert) {
  this.set('occurrences', Ember.A());

  this.on('calendarAddOccurrence', (occurrence) => {
    this.get('occurrences').pushObject(occurrence);
  });

  this.on('calendarRemoveOccurrence', (occurrence) => {
    this.get('occurrences').removeObject(occurrence);
  });

  this.render(hbs`
    {{as-calendar
      title="Ember Calendar"
      occurrences=occurrences
      dayStartingTime="9:00"
      dayEndingTime="18:00"
      timeSlotDuration="00:30"
      onAddOccurrence="calendarAddOccurrence"
      onRemoveOccurrence="calendarRemoveOccurrence"}}
  `);

  selectTime({ day: 0, timeSlot: 0 });

  assert.equal($('.as-calendar-occurrence').length, 1,
    'it adds the occurrence to the calendar'
  );

  Ember.run(() => {
    $('.as-calendar-occurrence .delete').click();
  });

  assert.equal($('.as-calendar-occurrence').length, 0,
    'it removes the occurrence from the calendar'
  );
});


test('Resize an occurrence', function(assert) {
  this.set('occurrences', Ember.A());

  this.on('calendarAddOccurrence', (occurrence) => {
    this.get('occurrences').pushObject(occurrence);
  });

  this.on('calendarUpdateOccurrence', (occurrence, properties) => {
    occurrence.setProperties(properties);
  });

  this.render(hbs`
    {{as-calendar
      title="Ember Calendar"
      occurrences=occurrences
      dayStartingTime="9:00"
      dayEndingTime="18:00"
      timeSlotDuration="00:30"
      defaultOccurrenceDuration="00:30"
      onAddOccurrence="calendarAddOccurrence"
      onUpdateOccurrence="calendarUpdateOccurrence"}}
  `);

  selectTime({ day: 0, timeSlot: 0 });

  assert.equal($('.as-calendar-occurrence').length, 1,
    'it adds the occurrence to the calendar'
  );

  resizeOccurrence($('.as-calendar-occurrence'), { timeSlots: 2 });

  assert.equal($('.as-calendar-occurrence').height(), timeSlotHeight() * 3,
    'it resizes the occurrence');
});

test('Drag an occurrence', function(assert) {
  this.set('occurrences', Ember.A());

  this.on('calendarAddOccurrence', (occurrence) => {
    this.get('occurrences').pushObject(occurrence);
  });

  this.on('calendarUpdateOccurrence', (occurrence, properties) => {
    occurrence.setProperties(properties);
  });

  this.render(hbs`
    {{as-calendar
      title="Ember Calendar"
      occurrences=occurrences
      dayStartingTime="9:00"
      dayEndingTime="18:00"
      timeSlotDuration="00:30"
      onAddOccurrence="calendarAddOccurrence"
      onUpdateOccurrence="calendarUpdateOccurrence"}}
  `);

  selectTime({ day: 0, timeSlot: 0 });

  assert.equal(this.$('.as-calendar-occurrence').length, 1,
    'it adds the occurrence to the calendar'
  );

  dragOccurrence(this.$('.as-calendar-occurrence'), { days: 2, timeSlots: 4 });

  var $occurrence = this.$('.as-calendar-occurrence');
  var dayOffset = Math.floor($occurrence.offset().left -
    this.$('.as-calendar-timetable-content').offset().left);
  var timeSlotOffset = Math.floor($occurrence.offset().top -
    this.$('.as-calendar-timetable-content').offset().top);

  assert.equal(dayOffset, Math.floor(dayWidth()) * 2,
    'it drags the occurrence to the correct day'
  );
  assert.equal(timeSlotOffset, timeSlotHeight() * 4,
    'it drags the occurrence to the correct timeslot'
  );
  assert.equal($occurrence.height(), timeSlotHeight() * 2,
    'it keeps the duration of the occurrence'
  );
});

test('Change time zone', function(assert) {
  this.set('occurrences', Ember.A([
    Ember.Object.create({
      startsAt: moment().utc().startOf('day').add(9, 'hours'),
      endsAt: moment().utc().startOf('day').add(10, 'hours'),
      title: 'Example Occurrence'
    })
  ]));

  this.on('calendarAddOccurrence', (occurrence) => {
    this.get('occurrences').pushObject(occurrence);
  });

  this.render(hbs`
    {{as-calendar
      title="Ember Calendar"
      occurrences=occurrences
      timeZone="UTC"
      dayStartingTime="9:00"
      dayEndingTime="18:00"
      timeSlotDuration="00:30"
      onAddOccurrence="calendarAddOccurrence"}}
  `);

  assert.equal($('.as-calendar-occurrence').position().top, 0,
    'it shows the occurrence in the UTC time zone');

  selectTimeZone('London');

  assert.equal($('.as-calendar-occurrence').position().top, timeSlotHeight() * 2,
    'it shows the occurrence in the London time zone');
});

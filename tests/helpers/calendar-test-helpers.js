import Ember from 'ember';

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
  var pageX = $target.offset().left + offsetX;
  var pageY = $target.offset().top + offsetY;

  return {
    pageX: pageX,
    pageY: pageY,
    clientX: pageX - $(document).scrollLeft(),
    clientY: pageY - $(document).scrollTop()
  };
};

var selectTime = function(options) {
  Ember.run(() => {
    var $target = $('.as-calendar-timetable-content');
    var point = pointForTime(options);
    var event = $.Event('click');

    event.pageX = point.pageX;
    event.pageY = point.pageY;

    $target.trigger(event);
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

export {
  timeSlotHeight,
  dayWidth,
  selectTime,
  resizeOccurrence,
  dragOccurrence,
  selectTimeZone
};

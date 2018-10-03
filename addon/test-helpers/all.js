import { run } from '@ember/runloop';
import $ from 'jquery';

var timeSlotHeight = function() {
  return $('.as-calendar-timetable-content')
    .find('.as-calendar-timetable__slot-item:first')
    .height();
};

var dayWidth = function() {
  var $content = $('.as-calendar-timetable-content');
  return $content.width() / $content.find('.as-calendar-timetable__day').length;
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
  run(() => {
    var $target = $('.as-calendar-timetable-content');
    var point = pointForTime(options);
    var event = $.Event('click');

    event.pageX = point.pageX;
    event.pageY = point.pageY;

    $target.trigger(event);
  });
};

var resizeOccurrence = function(occurrence, options) {
  run(() => {
    occurrence.find('.as-calendar-occurrence__resize-handle').simulate('drag', {
      dx: 0,
      dy: options.timeSlots * timeSlotHeight() + occurrence.height()
    });
  });
};

var dragOccurrence = function(occurrence, options) {
  run(() => {
    occurrence.simulate('drag', {
      dx: options.days * dayWidth(),
      dy: options.timeSlots * timeSlotHeight() + occurrence.height()
    });
  });
};

var selectTimeZone = function(name) {
  run(() => {
    $('.as-calendar-time-zone-select .rl-dropdown-toggle').click();
  });

  run(() => {
    $(`.as-calendar-time-zone-option:contains('${name}')`).click();
  });
};

var selectNextWeek = function() {
  run(() => {
    $('button.as-calendar-header__nav-group-action--next-week').click();
  });
};

var selectPreviousWeek = function() {
  run(() => {
    $('button.as-calendar-header__nav-group-action--previous-week').click();
  });
};

export {
  timeSlotHeight,
  dayWidth,
  selectTime,
  resizeOccurrence,
  dragOccurrence,
  selectTimeZone,
  selectNextWeek,
  selectPreviousWeek
};


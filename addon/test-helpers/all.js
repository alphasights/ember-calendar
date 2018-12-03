import { run } from '@ember/runloop';
import $ from 'jquery';
import { drag } from 'ember-calendar/tests/helpers/drag-drop';

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

var resizeOccurrence = async function(occurrence, options) {
  let dragSelector = occurrence.find('.as-calendar-occurrence__resize-handle');
  await drag(dragSelector, {
    dropEndOptions: {
      pageX: 0,
      pageY: options.timeSlots * timeSlotHeight() + occurrence.height()
    }
  });
};

var dragOccurrence = async function(occurrence, options) {
  await drag(occurrence, {
    dropEndOptions: {
      pageX: options.days * dayWidth(),
      pageY: options.timeSlots * timeSlotHeight() + occurrence.height()
    }
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
  selectNextWeek,
  selectPreviousWeek
};


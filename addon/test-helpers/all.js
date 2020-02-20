import { run } from '@ember/runloop';
import { click, find, triggerEvent } from '@ember/test-helpers';
import { drag } from 'ember-drag-drop/test-support/helpers/drag-drop';

const timeSlotHeight = function() {
  return find('.as-calendar-timetable-content')
    .find('.as-calendar-timetable__slot-item:first')
    .offsetHeight;
};

const dayWidth = function() {
  const $content = find('.as-calendar-timetable-content');
  return $content.offsetWidth() / $content.findAll('.as-calendar-timetable__day').length;
};

const pointForTime = function(options) {
  const $target = find('.as-calendar-timetable-content');
  const offsetX = options.day * dayWidth();
  const offsetY = options.timeSlot * timeSlotHeight();
  const pageX = $target.getBoundingClientRect().left + offsetX;
  const pageY = $target.getBoundingClientRect().top + offsetY;

  return {
    pageX: pageX,
    pageY: pageY,
    clientX: pageX - document.documentElement.scrollLeft,
    clientY: pageY - document.documentElement.scrollTop
  };
};

const selectTime = function(options) {
  run(() => {
    const $target = find('.as-calendar-timetable-content');
    const point = pointForTime(options);

    triggerEvent($target, 'click', point);
  });
};

const resizeOccurrence = async function(occurrence, options) {
  let dragSelector = occurrence.find('.as-calendar-occurrence__resize-handle');
  await drag(dragSelector, {
    dropEndOptions: {
      pageX: 0,
      pageY: options.timeSlots * timeSlotHeight() + occurrence.offsetHeight
    }
  });
};

const dragOccurrence = async function(occurrence, options) {
  await drag(occurrence, {
    dropEndOptions: {
      pageX: options.days * dayWidth(),
      pageY: options.timeSlots * timeSlotHeight() + occurrence.offsetHeight
    }
  });
};

const selectNextWeek = async function() {
  await click('button.as-calendar-header__nav-group-action--next-week');
};

const selectPreviousWeek = async function() {
 await click('button.as-calendar-header__nav-group-action--previous-week');
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


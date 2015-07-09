import Ember from 'ember';

export default {
  timeSlotHeight: function() {
    return $('.as-calendar-timetable-content')
      .find('.time-slots > li:first')
      .height();
  },

  dayWidth: function() {
    var $content = $('.as-calendar-timetable-content');
    return $content.width() / $content.find('.days > li').length;
  },

  pointForTime: function(options) {
    var $target = $('.as-calendar-timetable-content');
    var offsetX = options.day * this.dayWidth();
    var offsetY = options.timeSlot * this.timeSlotHeight();
    var pageX = $target.offset().left + offsetX;
    var pageY = $target.offset().top + offsetY;

    return {
      pageX: pageX,
      pageY: pageY,
      clientX: pageX - $(document).scrollLeft(),
      clientY: pageY - $(document).scrollTop()
    };
  },

  selectTime: function(options) {
    Ember.run(() => {
      var $target = $('.as-calendar-timetable-content');
      var point = this.pointForTime(options);
      var event = $.Event('click');

      event.pageX = point.pageX;
      event.pageY = point.pageY;

      $target.trigger(event);
    });
  },

  resizeOccurrence: function(occurrence, options) {
    Ember.run(() => {
      occurrence.find('.resize-handle').simulate('drag', {
        dx: 0,
        dy: options.timeSlots * this.timeSlotHeight()
      });
    });
  },

  dragOccurrence: function(occurrence, options) {
    Ember.run(() => {
      occurrence.simulate('drag', {
        dx: options.days * this.dayWidth(),
        dy: options.timeSlots * this.timeSlotHeight()
      });
    });
  },

  selectTimeZone: function(name) {
    Ember.run(() => {
      $('.as-calendar-time-zone-select .rl-dropdown-toggle').click();
    });

    Ember.run(() => {
      $(`.as-calendar-time-zone-option:contains('${name}')`).click();
    });
  }
};

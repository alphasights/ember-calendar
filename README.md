# Ember Calendar

[![Npm Version](https://badge.fury.io/js/ember-calendar.svg)](http://badge.fury.io/js/ember-ember-calendar)
[![Code
Climate](https://codeclimate.com/github/alphasights/ember-calendar/badges/gpa.svg)](https://codeclimate.com/github/alphasights/ember-calendar)
[![Build Status](https://circleci.com/gh/alphasights/ember-calendar.svg?style=shield&circle-token=6fa581b50c5f8496cf26768394cf6c1d43dfb98e)](https://circleci.com/gh/alphasights/ember-calendar)

An awesome Ember calendar, designed with composability and reusability in mind.

![Calendar in
action](https://raw.githubusercontent.com/alphasights/ember-calendar/images/calendar.png)

![Calendar with timezones](https://raw.githubusercontent.com/alphasights/ember-calendar/images/calendar-timezones.png)

## Features

* Click to add occurrences
* Resize occurrences
* Drag and drop occurrences
* Timezone aware
* Search and change timezones

## Installation

`ember install ember-calendar`

## Philosophy

Following the principle "Data down, Actions up", the calendar sends these
actions up:

* `onAddOccurrence`
* `onUpdateOccurrence`
* `onRemoveOccurrence`

In addition, you need to provide an `occurrences` Ember Array to the component.
Each occurrence should have these properties:

* `title`
* `startsAt`
* `endsAt`

The component never mutates your data, but merely decorates them and uses these
proxies to display the occurrences in the calendar. In the case you need to access
the original object in the template, it is available as `occurrence.content`.

## Basic Usage

```htmlbars
{{! app/templates/index.hbs }}

{{as-calendar
  title="Ember Calendar"
  occurrences=occurrences
  defaultTimeZoneQuery="New York|London|Dubai|Hong Kong"
  dayStartingTime="9:00"
  dayEndingTime="18:00"
  timeSlotDuration="00:30"
  onAddOccurrence="calendarAddOccurrence"
  onUpdateOccurrence="calendarUpdateOccurrence"
  onRemoveOccurrence="calendarRemoveOccurrence"}}
```

```javascript
// app/controllers/index.js

import Ember from 'ember';

export default Ember.Controller.extend({
  occurrences: Ember.A(),

  actions: {
    calendarAddOccurrence: function(occurrence) {
      this.get('occurrences').pushObject(Ember.Object.create({
        title: occurrence.get('title'),
        startsAt: occurrence.get('startsAt'),
        endsAt: occurrence.get('endsAt')
      }));
    },

    calendarUpdateOccurrence: function(occurrence, properties) {
      occurrence.setProperties(properties);
    },

    calendarRemoveOccurrence: function(occurrence) {
      this.get('occurrences').removeObject(occurrence);
    }
  }
});
```

```scss
// app/styles/app.scss

@import 'addons/ember-calendar/main';
```

## Advanced Usage

All the components which are used in the calendar are highly reusable. For
example, you can customize the appearance of the occurrences by passing a block:

```htmlbars
{{#as-calendar
  title="Schedule call"
  occurrences=occurrences
  dayStartingTime="7:00"
  dayEndingTime="21:30"
  timeSlotDuration="00:30"
  timeZoneOptions=timeZoneOptions
  timeZoneSearchEnabled=false
  timeZone=timeZone
  onAddOccurrence="calendarAddOccurrence" as |occurrence timetable calendar|}}
  {{#if occurrence.content.isEditable}}
    {{as-calendar/timetable/occurrence
      class="selection"
      model=occurrence
      timeSlotHeight=calendar.timeSlotHeight
      timetable=timetable
      timeSlotDuration=calendar.modelTimeSlotDuration
      isResizable=false
      onUpdate="calendarUpdateOccurrence"
      onRemove="calendarRemoveOccurrence"}}
  {{else}}
    {{as-calendar/occurrence
      model=occurrence
      timeSlotHeight=calendar.timeSlotHeight
      timeSlotDuration=calendar.modelTimeSlotDuration}}
  {{/if}}
{{/as-calendar}}
```

In this example, we check if the original occurrence is editable and either show
an occurrence which can be interacted with (`as-calendar/timetable/occurrence`)
or just a static occurrence (`as-calendar/occurrence`). Furthermore, the nested
components try to assume as less as possible about their ancestors, so we pass
in most of their attributes manually.

You can customize the timeslots by passing these options:

* `dayStartingTime`
* `dayEndingTime`
* `timeSlotDuration`
* `timeSlotHeight`
* `defaultOccurrenceTitle`
* `defaultOccurrenceDuration`

In addition, you can customize the timezone handling using these options:

* `timeZone`
* `timeZoneOptions`
* `defaultTimeZoneQuery`
* `timeZoneSearchEnabled`

## Developing

### Setup

* `git clone https://github.com/alphasights/ember-calendar.git`
* `npm install && bower install`

### Running

* `ember server`

### Running Tests

* `ember test --server`

## Credits

* [ember-sortable](https://github.com/jgwhite/ember-sortable)

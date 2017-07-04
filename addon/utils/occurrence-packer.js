
/*
 @via https://stackoverflow.com/a/11323909
 */
export function packColumns(columns) {
  let n = columns.length;
  for (let i = 0; i < n; i++) {
    let col = columns[i];
    for (let j = 0; j < col.length; j++) {
      col[j].setProperties({
        columns: n,
        column: i
      });
    }
  }
}

export function collidesWith(aOccurrence, bOccurrence) {
  return aOccurrence.get('endsAt').getTime() > bOccurrence.get('startsAt').getTime() &&
    aOccurrence.get('startsAt').getTime() < bOccurrence.get('endsAt').getTime();
}

export function pack(occurrences) {
  let lastEnding = null;
  let columns = [];

  occurrences.sort((a, b) => {
    const aTop = a.get('startsAt').getTime();
    const aBottom = a.get('endsAt').getTime() - 1;
    const bTop = b.get('startsAt').getTime();
    const bBottom = b.get('endsAt').getTime() - 1;

    if (aTop < bTop) return -1;
    if (aTop > bTop) return 1;
    if (aBottom < bBottom) return -1;
    if (aBottom > bBottom) return 1;
    return 0;
  }).forEach((occurrence) => {

    if (lastEnding !== null && occurrence.get('startsAt').getTime() >= lastEnding) {
      packColumns(columns);
      columns = [];
      lastEnding = null;
    }

    let placed = false;
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      if (!collidesWith(col[col.length - 1], occurrence)) {
        col.push(occurrence);
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push([occurrence]);
    }

    if (lastEnding === null || occurrence.get('endsAt').getTime() > lastEnding) {
      lastEnding = occurrence.get('endsAt').getTime();
    }
  });

  if (columns.length > 0) {
    packColumns(columns);
  }

  return occurrences;
}

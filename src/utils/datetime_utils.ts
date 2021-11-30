export function reportTimeToFullString(
  date: Date,
  newLine: boolean = false,
): string {
  return (
    dateToString(date) + (newLine ? '\n' : '') + ' at ' + timeToString(date)
  );
}

export function dateToString(date: Date): string {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return month + '-' + day + '-' + year;
}

export function dateToRelativeText(date: Date): string {
  if (isToday(date)) {
    return timeToString(date, true)
  }
  if (isYesterday(date)) {
    return 'Yesterday'
  }
  return date.toLocaleDateString("en-US", { month: 'short', day: 'numeric'})
}

export function timeToString(time: Date, space: boolean = false): string {
  var hr = time.getHours();
  var min = time.getMinutes();
  var minStr = min.toString();
  if (min < 10) {
    minStr = '0' + min;
  }
  var ampm = 'am';
  if (hr > 12) {
    hr -= 12;
    ampm = 'pm';
  }
  if (hr === 12) {
    ampm = 'pm';
  }
  return hr + ':' + minStr + (space ? ' ' : '') + ampm;
}

export function isToday(first: Date): boolean {
  const second = new Date();
  return first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();
}

export function isYesterday(first: Date): boolean {
  const second = new Date();
  return first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();
}

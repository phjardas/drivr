export function toList(obj) {
  const list = [];
  for (let id in obj) {
    list.push(Object.assign({ id }, obj[id]));
  }
  return list;
}

function lpad(str, minLength, padChar = ' ') {
  const diff = minLength - str.length;
  for (let i = 0; i < diff; i++) {
    str = padChar + str;
  }
  return str;
}

export function toDateString(date) {
  return lpad(date.getFullYear().toString(), 4, '0')
    + '-'
    + lpad((date.getMonth() + 1).toString(), 2, '0')
    + '-'
    + lpad(date.getDate().toString(), 2, '0');
}

export function toTimeString(date, includeSeconds = true) {
  let str = lpad(date.getHours().toString(), 2, '0')
    + ':'
    + lpad(date.getMinutes().toString(), 2, '0');

  if (includeSeconds) {
    str += ':' + lpad(date.getSeconds().toString(), 2, '0');
  }

  return str;
}

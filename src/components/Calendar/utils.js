
/**
 * format date
 * @param {Date} date 
 * @param {string} format 'YYYY-MM-DD'
 */
export function formatDate(date, format='YYYY-MM-DD') {
  date = new Date(date);
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  let d = date.getDate()
  let str = format
    .replace(/DD/, ('0' + d).slice(-2))
    .replace(/D/, d)
    .replace(/YYYY/, y)
    .replace(/YY/, String(y).slice(2))
    .replace(/MM/, ('0' + m).slice(-2))
    .replace(/M/, m)
  return str
}
export function validateDateInput (val) {
  return val === null || val instanceof Date || typeof val === 'string' || typeof val === 'number'
}
export function daysInMonth (year, month) {
  return /8|3|5|10/.test(month) ? 30 : month === 1 ? (!(year % 4) && year % 100) || !(year % 400) ? 29 : 28 : 31
}
export function compareDates (date1, date2) {
  const d1 = new Date(date1.getTime())
  const d2 = new Date(date2.getTime())
  d1.setHours(0, 0, 0, 0)
  d2.setHours(0, 0, 0, 0)
  return d1.getTime() === d2.getTime()
}
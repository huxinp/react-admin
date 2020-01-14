import moment from 'moment';

export function getTodayTime(value) {
  var today = moment();
  today.locale(value.locale()).utcOffset(value.utcOffset());
  return today;
}

export function getMonthName(month) {
  var locale = month.locale();
  var localeData = month.localeData();
  return localeData[locale === 'zh-cn' ? 'months' : 'monthsShort'](month);
}
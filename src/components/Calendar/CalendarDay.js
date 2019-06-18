import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { daysInMonth, compareDates, formatDate } from './utils';
import { Cell, Header } from './common';

function loop() {}

export default class CalendarDay extends React.PureComponent {
  // 选择日期
  selectDate = date => {
      if (date.isDisabled) {
        this.props.selectedDisabled(date);
        return false
      }
      this.props.selectDate(date);
  }
  // 显示月度历表
  showMonthCalendar = () => {
    this.props.showMonthCalendar()
  }
  // 上个月
  prevMonth = () => {
    if (!this.isPrevMonthDisabled()) {
      this.changeMonth(-1)
    }
  }
  // 下个月
  nextMonth = () => {
    if (!this.isNextMonthDisabled()) {
      this.changeMonth(+1)
    }
  }
  // 更改月份
  changeMonth = incrementBy => {
    let date = this.props.pageDate
    date = new Date(date.setMonth(date.getMonth() + incrementBy));
    this.props.changeMonth(date);
  }
  // 开始空 cell 个数
  blankDaysBefore = () => {
    const d = this.props.pageDate;
    let dObj = new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes())
    const day = dObj.getDay();
    if (this.props.mondayFirst) {
      return day > 0 ? day - 1 : 6
    }
    return day
  }
  // 结尾空 cell 个数
  blankDaysAfter = () => {
    const d = this.props.pageDate;
    let dObj = new Date(d.getFullYear(), d.getMonth() + 1)
    dObj = new Date(dObj.setDate(dObj.getDate() - 1));
    const day = dObj.getDay();
    if (this.props.mondayFirst) {
      return day === 0 ? 0 : 7 - day;
    }
    return 6 - day;
  }
  // 本月的 days
  days = () => {
    const d = this.props.pageDate
    let days = []
    let dObj = new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes())
    let dInMonth = daysInMonth(dObj.getFullYear(), dObj.getMonth());
    for (let i = 0; i < dInMonth; i++) {
      days.push({
        date: dObj.getDate(),
        timestamp: dObj.getTime(),
        isSelected: this.isSelectedDate(dObj),
        isDisabled: this.isDisabledDate(dObj),
        isHighlighted: this.isHighlightedDate(dObj),
        isHighlightStart: this.isHighlightStart(dObj),
        isHighlightEnd: this.isHighlightEnd(dObj),
        isToday: compareDates(dObj, new Date()),
        isWeekend: dObj.getDay() === 0 || dObj.getDay() === 6,
        isSaturday: dObj.getDay() === 6,
        isSunday: dObj.getDay() === 0
      })
      dObj.setDate(dObj.getDate() + 1)
    }
    return days
  }
  // 是否被选中
  isSelectedDate = date => {
    return this.props.selectedDate && compareDates(this.props.selectedDate, date)
  }
  // 是否被禁选
  isDisabledDate = date => {
    const { disabledDates } = this.props;
    let result = false

    if (typeof disabledDates === 'undefined') {
      return false
    }

    if (typeof disabledDates.dates !== 'undefined') {
      disabledDates.dates.forEach((d) => {
        if (compareDates(date, d)) {
          result = true
          return true
        }
      })
    }
    if (typeof disabledDates.to !== 'undefined' && disabledDates.to && date < disabledDates.to) {
      result = true
    }
    if (typeof disabledDates.from !== 'undefined' && disabledDates.from && date > disabledDates.from) {
      result = true
    }
    if (typeof disabledDates.ranges !== 'undefined') {
      disabledDates.ranges.forEach((range) => {
        if (typeof range.from !== 'undefined' && range.from && typeof range.to !== 'undefined' && range.to) {
          if (date < range.to && date > range.from) {
            result = true
            return true
          }
        }
      })
    }
    if (typeof disabledDates.days !== 'undefined' && disabledDates.days.indexOf(date.getDay()) !== -1) {
      result = true
    }
    if (typeof disabledDates.daysOfMonth !== 'undefined' && disabledDates.daysOfMonth.indexOf(date.getDate(date)) !== -1) {
      result = true
    }
    if (typeof disabledDates.customPredictor === 'function' && disabledDates.customPredictor(date)) {
      result = true
    }
    return result
  }
  // 是否高亮
  isHighlightedDate = date => {
    const { highlighted } = this.props;
    if (typeof highlighted === 'undefined') {
      return false
    }
    // 禁选的高亮
    if (!highlighted.includeDisabled && this.isDisabledDate(date)) {
      return false
    }

    let result = false


    if (typeof highlighted.dates !== 'undefined') {
      highlighted.dates.forEach((d) => {
        if (compareDates(date, d)) {
          result = true
          return true
        }
      })
    }

    if (highlighted.from && highlighted.to) {
      result = date >= highlighted.from && date <= highlighted.to
    }

    if (typeof highlighted.days !== 'undefined' && highlighted.days.indexOf(date.getDay()) !== -1) {
      result = true
    }

    if (typeof highlighted.daysOfMonth !== 'undefined' && highlighted.daysOfMonth.indexOf(date.getDate()) !== -1) {
      result = true
    }

    if (typeof highlighted.customPredictor === 'function' && highlighted.customPredictor(date)) {
      result = true
    }

    return result
  }
  // 是否开始高亮
  isHighlightStart = date => {
    const start = this.props.highlighted && this.props.highlighted.from
    return this.isHighlightedDate(date) && (start instanceof Date) &&
      (start.getFullYear(start) === date.getFullYear()) &&
      (start.getMonth(start) === date.getMonth()) &&
      (start.getDate(start) === date.getDate())
  }
  // 是否结束高亮
  isHighlightEnd = date => {
    const end = this.props.highlighted && this.props.highlighted.to
    return this.isHighlightedDate(date) && (end instanceof Date) &&
      (end.getFullYear(end) === date.getFullYear(date)) &&
      (end.getMonth(end) === date.getMonth(date)) &&
      (end.getDate(end) === date.getDate(date))
  }
  // 是否禁止切换上一月
  isPrevMonthDisabled = () => {
    const disabledDates = this.props.disabledDates;
    if (!disabledDates || !disabledDates.to) {
      return false
    }
    let d = this.props.pageDate
    return disabledDates.to.getMonth() >= d.getMonth() &&
    disabledDates.to.getFullYear() >= d.getFullYear()
  }
  // 是否禁止切换下一个月
  isNextMonthDisabled = () => {
    const disabledDates = this.props.disabledDates;
    if (!disabledDates || !disabledDates.from) {
      return false
    }
    let d = this.pageDate
    return disabledDates.from.getMonth() <= d.getMonth() &&
    disabledDates.from.getFullYear() <= d.getFullYear()
  }
  // 一周内每日的 label
  daysOfWeek = () => {
    const { mondayFirst, translation } = this.props;
    if (mondayFirst) {
      const tempDays = translation.days.slice()
      tempDays.push(tempDays.shift())
      return tempDays
    }
    return translation.days
  }
  // 生成 日期的 className
  dayClassName = day => {
    return classnames('cell cell-content', {
      'selected': day.isSelected,
      'disabled': day.isDisabled,
      'highlighted': day.isHighlighted,
      'today': day.isToday,
      'weekend': day.isWeekend,
      'sat': day.isSaturday,
      'sun': day.isSunday,
      'highlight-start': day.isHighlightStart,
      'highlight-end': day.isHighlightEnd
    })
  }
  render () {
    const { className, Header, HeaderCell, Cell, pageDate, translation } = this.props;
    const daysOfWeek = this.daysOfWeek();
    const blankDaysBefore = this.blankDaysBefore();
    const blankDaysAfter = this.blankDaysAfter();
    const days = this.days();
    const middleLabel = formatDate(pageDate, translation.formatForDayHeader || 'YYYY年 MM月')
    return (
      <div className={classnames('calendar', 'calendar-day', className)}>
        <Header
          prev={this.prevMonth}
          next={this.nextMonth}
          middleUp={this.showMonthCalendar}
          title={middleLabel}
          disabled={{
            next: this.isNextMonthDisabled(),
            prev: this.isPrevMonthDisabled()
          }}
        />
        <div className="calendar-body">
          { daysOfWeek.map(d => <div key={d} className="cell cell-header"><HeaderCell title={d} /></div>) }
          { // 开始空cell
            blankDaysBefore > 0 && Array(blankDaysBefore).fill(0).map((d,i) => {
              return (<div key={i} className="cell cell-empty"><Cell /></div>)
            })
          }
          { 
            days.map(d => {
              return (
                <div key={d.date}
                  className={this.dayClassName(d)}
                  onClick={() => this.selectDate(d)}
                >
                  <Cell title={d.date} day={d} />
                </div>
              )
            })
          }
          { // 结尾空cell
            blankDaysAfter > 0 && Array(blankDaysAfter).fill(0).map((d,i) => {
              return (<div key={i} className="cell cell-empty"><Cell /></div>)
            })
          }
        </div>
      </div>
    )
  }
}
CalendarDay.defaultProps = {
  // React Component
  Cell: Cell,
  HeaderCell: Cell,
  Header: Header,
  // props
  dayCellContent: day => day.date,
  translation: { // 日期的显示方式 英文缩写, 周* , 星期* 等   请务必周日开头
    days: ['日', '一', '二', '三', '四', '五', '六'],
    formatForDayHeader: 'YYYY年 MM月'
  },
  disabledDates: undefined, /* { // 禁选的日期
    dates: Date Array,
    from: Date,
    to: Date,
    days: day Array,
    daysInMonth: date Array,
    customPredictor: func,
    ranges: [{from: Date, to: Date}],
  },*/
  highlighted: undefined, /* { // 高亮的日期
    from: Date,
    to: Date,
    includeDisabled: boolean,
    dates: Date Array,
    days: day Array,
    daysOfMonth: date Array,
    customPredictor: func,
  },*/
  pageDate: new Date(),
  mondayFirst: true,
  // func handle
  changeMonth: loop,
  selectDate: loop,
  selectedDisabled: loop,
  showMonthCalendar: loop,
}
CalendarDay.propTypes = {
  className: PropTypes.string,
  CalendarHeader: PropTypes.element,

  showDayView: PropTypes.bool,
  selectedDate: PropTypes.instanceOf(Date),
  pageDate: PropTypes.instanceOf(Date),
  pageTimestamp: PropTypes.number,
  fullMonthName: PropTypes.bool,
  allowedToShowView: PropTypes.func,
  dayCellContent: PropTypes.func,
  disabledDates: PropTypes.object,
  highlighted: PropTypes.object,
  calendarClass: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  calendarStyle: PropTypes.object,
  translation: PropTypes.object,
  mondayFirst: PropTypes.bool,
  useUtc: PropTypes.bool,
  // React component
  Header: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  Cell: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  HeaderCell: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  // 事件响应
  changeMonth: PropTypes.func,
  selectDate: PropTypes.func,
  selectedDisabled: PropTypes.func,
  showMonthCalendar: PropTypes.func,
}
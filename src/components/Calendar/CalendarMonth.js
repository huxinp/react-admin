import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { formatDate } from './utils';
import { Cell, Header } from './common';

function loop() {}

export default class CalendarMonth extends React.PureComponent {
  // 选择月份
  selectMonth = month => {
    if (month.isDisabled) {
      return false
    }
    this.props.selectMonth(month);
  }
  showYearCalendar = () => {
    this.props.showYearCalendar()
  }
  // 更年份
  changeYear = incrementBy => {
    let date = this.props.pageDate
    date.setFullYear(date.getFullYear() + incrementBy)
    this.props.changeYear(date)
  }
  // 上一年
  prevYear () {
    if (!this.isPrevYearDisabled()) {
      this.changeYear(-1)
    }
  }
  // 是否可选上一年
  isPrevYearDisabled = () => {
    const { disabledDates, pageDate } = this.props;
    if (!disabledDates || !disabledDates.to) {
      return false
    }
    return disabledDates.to.getFullYear() >= pageDate.getFullYear()
  }
  // 下一年
  nextYear = () => {
    if (!this.isNextYearDisabled()) {
      this.changeYear(1)
    }
  }
  // 下一年是否可选
  isNextYearDisabled = () => {
    const { disabledDates, pageDate } = this.props;
    if (!disabledDates || !disabledDates.from) {
      return false
    }
    return disabledDates.from.getFullYear() <= pageDate.getFullYear()
  }
  isSelectedMonth = date => {
    const { selectedDate } = this.props;
    return (selectedDate &&
      selectedDate.getFullYear() === date.getFullYear() &&
      selectedDate.getMonth() === date.getMonth())
  }
  isDisabledMonth = date => {
    const { disabledDates } = this.props;
    let result = false
    if (typeof disabledDates === 'undefined') {
      return false
    }
    const { to, from, customPredictor } = disabledDates;
    if (typeof disabledDates.to !== 'undefined' && disabledDates.to) {
      if (
        (date.getMonth() < to.getMonth() && date.getFullYear() <= to.getFullYear()) ||
        date.getFullYear() < to.getFullYear()
      ) {
        result = true
      }
    }
    if (typeof from !== 'undefined' && from) {
      if (
        (date.getMonth() > this.utils.getMonth(from) && date.getFullYear() >= this.utils.getFullYear(from)) ||
        date.getFullYear() > this.utils.getFullYear(from)
      ) {
        result = true
      }
    }
    if (typeof customPredictor === 'function' && customPredictor(date)) {
      result = true
    }
    return result
  }
  months = () => {
    const d = this.props.pageDate
    let months = []
    let dObj = new Date(d.getFullYear(), 0, d.getDate(), d.getHours(), d.getMinutes())
    for (let i = 0; i < 12; i++) {
      months.push({
        month: this.props.translation.months[i],
        timestamp: dObj.getTime(),
        isSelected: this.isSelectedMonth(dObj),
        isDisabled: this.isDisabledMonth(dObj)
      })
      dObj.setMonth(dObj.getMonth() + 1)
    }
    return months
  }
  monthClassName = month => {
    return classnames('cell cell-content', {
      'selected': month.isSelected,
      'disabled': month.isDisabled,
    })
  }
  render () {
    const { className, pageDate, translation, Cell, Header } = this.props;
    const middleLabel = formatDate(pageDate, translation.formatForMonthHeader || 'YYYY年');
    const months = this.months();
    return (
      <div className={classnames('calendar', 'calendar-month', className)}>
        <Header
          prev={this.prevYear}
          next={this.nextYear}
          middleUp={this.showYearCalendar}
          title={middleLabel}
          disabled={{
            next: this.isNextYearDisabled(),
            prev: this.isPrevYearDisabled()
          }}
        />
        <div className="calendar-body">
          {
            months.map(m => (
              <div
                key={m.month}
                className={this.monthClassName(m)}
                onClick={() => this.selectMonth(m)}
              >
                <Cell title={m.month} month={m} />
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}
CalendarMonth.defaultProps = {
  // props attribute 
  disabledDates: undefined, /*{ // 禁选日期
    to: Date,
    from: Date,
    customPredictor: func
  },*/
  translation: {
    formatForMonthHeader: 'YYYY年',
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  },
  // React Component
  Header: Header,
  Cell: Cell,
  // func handle
  changeYear: loop,
  selectMonth: loop,
  showYearCalendar: loop,
}
CalendarMonth.propTypes = {
  // props attribute
  className: PropTypes.string,
  showMonthView: PropTypes.bool,
  selectedDate: PropTypes.instanceOf(Date),
  pageDate: PropTypes.instanceOf(Date),
  pageTimestamp: PropTypes.number,
  disabledDates: PropTypes.object,
  calendarClass: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  calendarStyle: PropTypes.object,
  translation: PropTypes.object,
  isRtl: PropTypes.bool,
  allowedToShowView: PropTypes.func,
  useUtc: PropTypes.bool,
  // React Component
  Header: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  Cell: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),

  // func handle
  changeYear: PropTypes.func,
  selectMonth: PropTypes.func,
  showYearCalendar: PropTypes.func,
}
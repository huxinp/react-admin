import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Cell, Header, HeaderCell } from './common';

function loop() {}

export default class CalendarWeek extends React.PureComponent {

  prevWeek = () => {

  }
  nextWeek = () => {

  }
  isNextWeekDisabled = () => {

  }
  isPrevWeekDisabled = () => {

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
  render () {
    const { className, Header, HeaderCell } = this.props;
    const daysOfWeek = this.daysOfWeek();
    return (
      <div className={classnames('calendar', 'calendar-week', className)}>
        <Header
          prev={this.prevWeek}
          next={this.nextWeek}
          middleUp={loop}
          title={''}
          disabled={{
            next: this.isNextWeekDisabled(),
            prev: this.isPrevWeekDisabled()
          }}
        />
        <div className="calendar-body">
          { daysOfWeek.map(d => <div key={d} className="cell cell-header"><HeaderCell title={d} /></div>) }
        </div>
      </div>
    )
  }
}
CalendarWeek.defaultProps = {
  // props attribute
  translation: { // 日期的显示方式 英文缩写, 周* , 星期* 等   请务必周日开头
    days: ['日', '一', '二', '三', '四', '五', '六'],
  },
  // React Component
  Cell: Cell,
  Header: Header,
  HeaderCell: HeaderCell,
  // func handle
  allowedToShowView: loop,
  selectYear: loop,
  changedDecade: loop,
}
CalendarWeek.propTypes = {
  // props attribute
  showYearView: PropTypes.bool,
  selectedDate: PropTypes.instanceOf(Date),
  pageDate: PropTypes.instanceOf(Date),
  pageTimestamp: PropTypes.number,
  disabledDates: PropTypes.object,
  highlighted: PropTypes.object,
  calendarClass: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  calendarStyle: PropTypes.object,
  translation: PropTypes.object,
  allowedToShowView: PropTypes.func,
  // React Component
  Cell: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  Header: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  HeaderCell: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  // func handle
  selectYear: PropTypes.func,
  changedDecade: PropTypes.func,
}
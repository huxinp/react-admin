import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Cell, Header } from './common';

function loop() {}

export default class CalendarYear extends React.PureComponent {
  years = () => {
    const d = this.props.pageDate
    let years = []
    let dObj = new Date(Math.floor(d.getFullYear() / 10) * 10, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes())
    for (let i = 0; i < 10; i++) {
      years.push({
        year: dObj.getFullYear(),
        timestamp: dObj.getTime(),
        isSelected: this.isSelectedYear(dObj),
        isDisabled: this.isDisabledYear(dObj)
      })
      dObj.setFullYear(dObj.getFullYear() + 1)
    }
    return years
  }
  getPageDecade = () => {
    const decadeStart = Math.floor(this.props.pageDate.getFullYear() / 10) * 10
    const decadeEnd = decadeStart + 9
    const yearSuffix = this.props.translation.formatForYearHeader
    return `${decadeStart} - ${decadeEnd}${yearSuffix}`
  }
  selectYear = year => {
    if (year.isDisabled) {
      return false
    }
    this.props.selectYear(year);
  }
  changeYear = incrementBy => {
    let date = this.props.pageDate
    date.setFullYear(date.getFullYear() + incrementBy)
    this.props.changedDecade(date);
  }
  prevDecade = () => {
    if (this.isPrevDecadeDisabled()) {
      return false
    }
    this.changeYear(-10)
  }
  isPrevDecadeDisabled = () => {
    const { disabledDates, pageDate } = this.props;
    if (!disabledDates || !disabledDates.to) {
      return false
    }
    const disabledYear = disabledDates.to.getFullYear()
    const lastYearInPreviousPage = Math.floor(pageDate.getFullYear() / 10) * 10 - 1
    return disabledYear > lastYearInPreviousPage
  }
  nextDecade = () => {
    if (this.isNextDecadeDisabled()) {
      return false
    }
    this.changeYear(10)
  }
  isNextDecadeDisabled = () => {
    const { disabledDates, pageDate } = this.props;
    if (!disabledDates || !disabledDates.from) {
      return false
    }
    const disabledYear = disabledDates.from.getFullYear()
    const firstYearInNextPage = Math.ceil(pageDate.getFullYear() / 10) * 10
    return disabledYear < firstYearInNextPage
  }
  isSelectedYear = date => {
    const { selectedDate } = this.props;
    return selectedDate && selectedDate.getFullYear() === date.getFullYear()
  }
  isDisabledYear = date => {
    const { disabledDates } = this.props;
    let disabled = false
    if (typeof disabledDates === 'undefined' || !disabledDates) {
      return false
    }
    const { to, from, customPredictor } = disabledDates;
    if (typeof to !== 'undefined' && to) {
      if (date.getFullYear() < to.getFullYear()) {
        disabled = true
      }
    }
    if (typeof from !== 'undefined' && from) {
      if (date.getFullYear() > from.getFullYear()) {
        disabled = true
      }
    }
    if (typeof customPredictor === 'function' && customPredictor(date)) {
      disabled = true
    }
    return disabled
  }
  yearClassName = year => {
    return classnames('cell cell-content', {
      'selected': year.isSelected,
      'disabled': year.isDisabled,
    })
  }
  render () {
    const { className, Header } = this.props;
    const years = this.years();
    const middleLabel = this.getPageDecade();
    return (
      <div className={classnames('calendar', 'calendar-year', className)}>
        <Header
          prev={this.prevDecade}
          next={this.nextDecade}
          middleUp={loop}
          title={middleLabel}
          disabled={{
            next: this.isNextDecadeDisabled(),
            prev: this.isPrevDecadeDisabled()
          }}
        />
        <div className="calendar-body">
          {
            years.map(y => (
              <div
                key={y.year}
                className={this.yearClassName(y)}
                onClick={() => this.selectYear(y)}
              >
                <Cell title={y.year} year={y} />
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}
CalendarYear.defaultProps = {
  // props attribute
  translation: {
    formatForYearHeader: ' 年代',
  },
  // React Component
  Cell: Cell,
  Header: Header,
  // func handle
  allowedToShowView: loop,
  selectYear: loop,
  changedDecade: loop,
}
CalendarYear.propTypes = {
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
  // func handle
  selectYear: PropTypes.func,
  changedDecade: PropTypes.func,
}
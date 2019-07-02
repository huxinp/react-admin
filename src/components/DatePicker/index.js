import React from 'react';
import PropTypes from 'prop-types';
import DateInput from './DateInput';
import Calendar from '../Calendar';
import { validateDateInput } from '../Calendar/utils';
import { Cell, HeaderCell, Header } from '../Calendar/common';
import './index.scss';

function loop() {}

export default class DatePicker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showDayView: false,
      showMonthView: false,
      showYearView: false,
      pageTimestamp: new Date().getTime(),
      resetTypedDate: new Date(),
      selectedDate: null,
    }
    this.datePickerWrap = null;
  }
  componentDidMount() {
    document.addEventListener('click', this.clickOutside);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.clickOutside);
    this.datePickerWrap = null;
  }
  clearDate = () => {
    console.log('clearDate')
  }
  // 打开 calendar
  showCalendar = () => {
    const { disabled } = this.props;
    if (disabled || this.isInline()) {
      return false
    }
    if (this.isOpen()) {
      return this.close(true)
    }
    this.setInitialView()
  }
  // 关闭 calendar
  close = state => {
    this.setState({
      showDayView: false,
      showMonthView: false,
      showYearView: false,
    });
    if (state) {
      this.props.onClosed();
    }
  }
  // calendar 是否打开状态
  isOpen = () => {
    const { showDayView, showMonthView, showYearView } = this.state;
    return showDayView || showMonthView || showYearView
  }
  
  computedInitialView = () => {
    if (!this.props.initialView) {
      return this.props.minimumView
    }
    return this.props.initialView
  }
  
  allowedToShowView = view => {
    const views = ['day', 'month', 'year']
    const minimumViewIndex = views.indexOf(this.props.minimumView)
    const maximumViewIndex = views.indexOf(this.props.maximumView)
    const viewIndex = views.indexOf(view)
    return viewIndex >= minimumViewIndex && viewIndex <= maximumViewIndex
  }
  // 打开指定 calendar
  openCalendar = view => {
    if (!this.allowedToShowView(view)) {
      return false
    }
    this.close()
    const viewMap = {
      day: 'showDayView',
      month: 'showMonthView',
      year: 'showYearView',
    }
    this.setState({
      [viewMap[view]]: true,
    })
    return true
  }
  // 打开 哪个 calendar
  setInitialView = () => {
    const initialView = this.computedInitialView()
    if (!this.allowedToShowView(initialView)) {
      throw new Error(`initialView '${this.props.initialView}' cannot be rendered based on minimum '${this.props.minimumView}' and maximum '${this.props.maximumView}'`)
    }
    this.openCalendar(initialView);
  }
  typedDate = date => {
    console.log('typedDate', date)
  }
  changeMonth = month => {
    this.setPageDate(month)
    this.props.onChangeMonth(month);
  }
  setPageDate = date => {
    if (!date) {
      if (this.props.openDate) {
        date = new Date(this.props.openDate)
      } else {
        date = new Date()
      }
    }
    this.setState({
      pageTimestamp: new Date(date).setDate(1),
    })
  }
  changeYear = date => {
    this.setPageDate(date)
    this.props.onChangeYear(date)
  }
  changedDecade = date => {
    this.setPageDate(date)
    this.props.onChangeDecade(date)
  }
  selectDate = date => {
    this.setDate(date.timestamp)
    if (!this.isInline()) {
      this.close(true)
    }
    this.setState({
      resetTypedDate: new Date(),
    })
    this.props.onSelectDate(date);
  }
  selectMonth = month => {
    const date = new Date(month.timestamp)
    if (this.allowedToShowView('day')) {
      this.changeMonth(date);
      this.openCalendar('day')
    } else {
      this.selectDate(month)
    }
  }
  selectYear = year => {
    const date = new Date(year.timestamp)
    if (this.allowedToShowView('month')) {
      this.changeYear(date);
      this.openCalendar('month')
    } else {
      this.selectDate(year)
    }
  }
  setDate = timestamp => {
    const date = new Date(timestamp)
    this.setState({
      selectedDate: date,
    });
    this.setPageDate(date)
    this.props.onSelected(date);
    this.props.onInput(date);
  }
  selectedDisabled = date => {

    this.props.onSelectedDisabled(date);
  }
  isInline = () => {
    return !!this.props.inline
  }
  makeCalendar = () => {
    const { mondayFirst, Cell, HeaderCell, Header } = this.props;
    const { showDayView, showMonthView, showYearView, pageTimestamp, selectedDate, Tip } = this.state;
    switch (true) {
      case showDayView:
        return (
          <div className="calendar-wrap">
            <Calendar.Day
              selectedDate={selectedDate}
              pageDate={new Date(pageTimestamp)}
              mondayFirst={mondayFirst}
              Cell={Cell}
              HeaderCell={HeaderCell}
              Header={Header}
              changeMonth={this.changeMonth}
              selectDate={this.selectDate}
              selectedDisabled={this.selectedDisabled}
              showMonthCalendar={() => this.openCalendar('month')}
            />
            { Tip && <Tip /> }
          </div>
        )
      case showMonthView:
        return (
          <div className="calendar-wrap">
            <Calendar.Month
              pageDate={new Date(pageTimestamp)}
              changeYear={this.changeYear}
              showYearCalendar={() => this.openCalendar('year')}
              selectMonth={this.selectMonth}
            />
          </div>
        )
      case showYearView:
        return (
          <div className="calendar-wrap">
            <Calendar.Year
              pageDate={new Date(pageTimestamp)}
              selectYear={this.selectYear}
              changedDecade={this.changedDecade}
            />
          </div>
        )
      default:
    }
  }
  clickOutside = (e) => {
    if (!this.datePickerWrap.contains(e.target)) {
      this.close(true);
    }
  }
  render() {
    const { disabled, typeable } = this.props;
    const { selectedDate } = this.state;
    return (
      <div className="date-picker" ref={el => this.datePickerWrap = el}>
        <DateInput
          clearDate={this.clearDate}
          showCalendar={this.showCalendar}
          closeCalendar={this.close}
          typedDate={this.typedDate}
          selectedDate={selectedDate}
          showMonthCalendar={this.showMonthCalendar}
          typeable={typeable}
        />
        { !disabled && this.makeCalendar() }
      </div>
    )
  }
}
DatePicker.defaultProps = {
  // React.Component
  Cell: Cell,
  HeaderCell: HeaderCell,
  Header: Header,
  // props
  minimumView: 'day',
  maximumView: 'year',
  format: 'YYYY-MM-DD',
  openDate: new Date(),
  value: new Date(),
  mondayFirst: true,
  inline: false,
  typeable: true,
  // func handle
  onChangeMonth: loop,
  onChangeYear: loop,
  onChangeDecade: loop,
  onSelectDate: loop,
  onSelectedDisabled: loop,
  onSelected: loop,
  onInput: loop,
  onClosed: loop,
}
DatePicker.propTypes = {
  // props attribute
  value: function(props, propName, componentName) {
    const val = props[propName];
    if (!validateDateInput(val)) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },
  name: PropTypes.string,
  id: PropTypes.string,
  format: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  openDate: function(props, propName, componentName) {
    const val = props[propName];
    if (!validateDateInput(val)) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },
  dayCellContent: PropTypes.func,
  fullMonthName: PropTypes.bool,
  disabledDates: PropTypes.object,
  highlighted: PropTypes.object,
  placeholder: PropTypes.string,
  inline: PropTypes.bool,
  calendarClass: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  inputClass: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  wrapperClass: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  mondayFirst: PropTypes.bool,
  clearButton: PropTypes.bool,
  clearButtonIcon: PropTypes.string,
  calendarButton: PropTypes.bool,
  calendarButtonIcon: PropTypes.string,
  calendarButtonIconContent: PropTypes.string,
  bootstrapStyling: PropTypes.bool,
  initialView: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  typeable: PropTypes.bool,
  useUtc: PropTypes.bool,
  minimumView: PropTypes.string,
  maximumView: PropTypes.string,
  // React Component
  Header: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  Cell: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  HeaderCell: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  Tip: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  // 事件外传
  onChangeMonth: PropTypes.func,
  onChangeYear: PropTypes.func,
  onChangeDecade: PropTypes.func,
  onSelectDate: PropTypes.func,
  onSelectedDisabled: PropTypes.func,
  onSelected: PropTypes.func,
  onInput: PropTypes.func,
  onClosed: PropTypes.func,
}
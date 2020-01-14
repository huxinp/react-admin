import React, { PropTypes } from 'react';
import MonthPanel from '../month/MonthPanel';

function goMonth(direction) {
  var next = this.props.value.clone();
  next.add(direction, 'months');
  this.props.onValueChange(next);
}

function goYear(direction) {
  var next = this.props.value.clone();
  next.add(direction, 'years');
  this.props.onValueChange(next);
}

function showIf(condition, el) {
  return condition ? el : null;
}

export default class CalendarHeader extends React.PureComponent {
  constructor (props) {
    super(props);
    this.nextMonth = goMonth.bind(this, 1);
    this.previousMonth = goMonth.bind(this, -1);
    this.nextYear = goYear.bind(this, 1);
    this.previousYear = goYear.bind(this, -1);
    this.onMonthSelect = this.onMonthSelect.bind(this);
    this.onYearSelect = this.onYearSelect.bind(this);
    this.state = {
      yearPanelReferer: null,
    }
  }

  componentDidMount() {

  }

  onMonthSelect(value) {
    this.props.onPanelChange(value, 'date');
    if (this.props.onMonthSelect) {
      this.props.onMonthSelect(value);
    } else {
      this.props.onValueChange(value);
    }
  }

  onYearSelect(value) {
    var referer = this.state.yearPanelReferer;
    this.setState({
      yearPanelReferer: null
    })
    this.props.onPanelChange(value, referer);
    this.props.onValueChange(value);
  }

  onDecadeSelect(value) {

  }

  changeYear(direction) {

  }

  monthYearElement(showTimePicker) {

  }

  showMonthPanel() {

  }

  showYearPanel(referer) {

  }

  showDecadePanel() {

  }

  render() {
    const {
      prefixCls, locale, mode, value, showTimePicker, enableNext,
      enablePrev, disabledMonth, renderFooter
    } = this.props;
    let panel = null;
    switch (mode) {
      case 'month':
        panel = React.createElement(MonthPanel, { prefixCls, })
        break;
      case 'year':
        break;
      case 'decade':
        break;
      default: 
        panel = null;
    }
    return React.createElement(
      'div',
      { className: prefixCls + '-header' },
      React.createElement(
        'div',
        { style: { position: 'relative' } },
        showIf(enablePrev && !showTimePicker, React.createElement('a', {
          className: prefixCls + '-prev-year-btn',
          role: 'button',
          onClick: this.previousYear,
          title: locale.previousYear,
        })),
        showIf(enablePrev && !showTimePicker, React.createElement('a', {
          className: prefixCls + '-prev-month-btn',
          role: 'button',
          onClick: this.previousMonth,
          title: locale.previousMonth,
        })),
        this.monthYearElement(showTimePicker),
        showIf(enableNext && !showTimePicker, React.createElement('a', {
          className: prefixCls + '-next-month-btn',
          onClick: this.nextMonth,
          title: locale.nextMonth,
        })),
        showIf(enableNext && !showTimePicker, React.createElement('a', {
          className: prefixCls + '-next-year-btn',
          onClick: this.nextYear,
          title: locale.nextYear,
        }))
      ),
      panel,
    )
  }
}

CalendarHeader.defaultProps = {
  enableNext: 1,
  enablePrev: 1,
  onPanelChange: function onPanelChange() {},
  onValueChange: function onValueChange() {},
}

CalendarHeader.propTypes = {
  prefixCls: PropTypes.string,
  value: PropTypes.object,
  onValueChange: PropTypes.func,
  showTimePicker: PropTypes.bool,
  onPanelChange: PropTypes.func,
  locale: PropTypes.object,
  enablePrev: PropTypes.any,
  enableNext: PropTypes.any,
  disabledMonth: PropTypes.func,
  renderFooter: PropTypes.func,
  onMonthSelect: PropTypes.func,
}
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getTodayTime, getMonthName } from '../util/index';

const ROW = 4;
const COL = 3;

function chooseMonth(month) {
  const next = this.state.value.clone();
  next.month(month);
  this.setAndSelectValue(next);
}

function noop() {}

export default class MonthTable extends React.Component {
  constructor(props) {
    super(props)
    this.setAndSelectValue = this.setAndSelectValue.bind(this);
    this.months = this.months.bind(this);
    this.state = {
      value: props.value,
    }
  }
  componentWillReceiveProps (nextProps) {
    if ('value' in nextProps) {
      this.setState({ value: nextProps.value })
    }
  }
  setAndSelectValue(value) {
    this.setState({ value });
    this.props.onSelect(value);
  }
  months() {
    const value = this.state.value;
    const current = value.clone();
    const months = [];
    let index = 0;
    for (let rowIndex = 0; rowIndex < ROW; rowIndex++) {
      months[rowIndex] = [];
      for (let colIndex = 0; colIndex < COL; colIndex++) {
        current.month(index);
        const content = getMonthName(current);
        months[rowIndex][colIndex] = {
          value: index,
          content,
          title: content
        };
        index++;
      }
    }
    return months;
  }
  render() {
    const { prefixCls, locale, contentRender, cellRender, disabledDate } = this.props;
    const { value } = this.state;
    const today = getTodayTime(value);
    const months = this.months();
    const currentMonth = value.month();
    const monthsEls = months.map(function(month, index) {
      const tds = month.map(function (monthData) {
        let disabled = false;
        if (disabledDate) {
          const testValue = value.clone();
          testValue.month(monthData.value);
          disabled = disabledDate(testValue);
        }
        const className = classnames(prefixCls + '-cell', {
          [prefixCls + '-cell-disabled']: disabled,
          [prefixCls + '-selected-cell']: monthData.value === currentMonth,
          [prefixCls + '-current-cell']: today.year() === value.year() && monthData.value === today.month()
        });
        let cellEl = void 0;
        if (cellRender) {
          const currentValue = value.clone();
          currentValue.month(monthData.value);
          cellEl = cellRender(currentValue, locale);
        } else {
          let content = void 0;
          if (contentRender) {
            const currentValue = value.clone();
            currentValue.month(monthData.value);
            content = contentRender(currentValue, locale);
          } else {
            content = monthData.content;
          }
          cellEl = React.createElement(
            'a',
            { className: prefixCls + '-month' },
            content
          );
        }
        return React.createElement(
          'td',
          {
            role: 'gridcell',
            key: monthData.value,
            className,
            title: monthData.title,
            onClick: disabled ? null : chooseMonth.bind(this, monthData.value)
          },
          cellEl
        )
      }.bind(this));
      return React.createElement(
        'tr',
        { key: index, role: 'row' },
        tds
      );
    }.bind(this))
    return React.createElement(
      'table',
      { className: prefixCls + '-table', cellSpacing: '0', role: 'grid' },
      React.createElement(
        'tbody',
        { className: prefixCls + '-tbody' },
        monthsEls
      )
    )
  }
}

MonthTable.defaultProps = {
  onSelect: noop,
}
MonthTable.propTypes = {
  onSelect: PropTypes.func,
  cellRender: PropTypes.func,
  prefixCls: PropTypes.string,
  value: PropTypes.object,
}
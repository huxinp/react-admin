import React from 'react';
import PropTypes from 'prop-types';
import YearPanel from '../year/YearPanel';
import MonthTable from './MonthTable';

function goYear(direction) {
  const next = this.state.value.clone();
  next.add(direction, 'year');
  this.setAndChangeValue(next);
}

function noop() {}

export default class MonthPanel extends React.Component {



  render() {
    return (
      <div>
        MonthPanel
      </div>
    )
  }
}

MonthPanel.defaultProps = {
  onChange: noop,
  onSelect: noop,
}

MonthPanel.propTypes = {
  onChange: PropTypes.func,
  disabledDate: PropTypes.func,
  onSelect: PropTypes.func,
  renderFooter: PropTypes.func,
  rootPrefixCls: PropTypes.string,
  value: PropTypes.object,
  defaultValue: PropTypes.object,
}
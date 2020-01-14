import React, { PropTypes } from 'react';

import MonthTable from './MonthTable';

function goYear(direction) {
  this.props.changeYear(direction);
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
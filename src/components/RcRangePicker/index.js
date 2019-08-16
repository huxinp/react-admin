import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Picker from 'rc-calendar/lib/Picker';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import zhCN from 'rc-calendar/lib/locale/zh_CN';

import './index.scss';

const formatStr = 'YYYY/MM/DD';

function loop () {}

function format(v) {
  return v ? v.format(formatStr) : '';
}
function isValidRange(v) {
  return v && v[0] && v[1];
}

class RcRangePicker extends React.Component {
  state = {
    value: [moment(), moment().add(7, 'days')],
    hoverValue: [],
  }

  componentWillReceiveProps({ value }) {
    if (value !== this.props.value) {
      this.setState({ value });
    }
  }
  onChange = value => {
    this.setState({ value });
    this.props.onChange(value);
  };

  onHoverChange = hoverValue => {
    this.setState({ hoverValue });
  };
  makeInput = ({ value }) => {
    return React.createElement(
      'div',
      { className: 'picker' },
      React.cloneElement(
        this.props.input,
        {
          value: (isValidRange(value) && `${format(value[0])} - ${format(value[1])}`) || '',
          readOnly: true,
          placeholder: '开始日期  ~  结束日期',
        }
      )
    )
  }

  render() {
    const { hoverValue, value, } = this.state;
    const calendar = (
      <RangeCalendar
        className="rc-range-picker"
        hoverValue={hoverValue}
        onHoverChange={this.onHoverChange}
        dateInputPlaceholder={['开始日期', '结束日期']}
        locale={zhCN}
        showWeekNumber={false}
        disabledDate={this.props.disabledDate}
      />
    )
    return (
      <Picker
        value={value}
        calendar={calendar}
        onChange={this.onChange}
      >
        { this.makeInput }
      </Picker>
    )
  }
}
RcRangePicker.defaultProps = {
  onChange: loop,
  input: <input />,
}
RcRangePicker.propTypes = {
  onChange: PropTypes.func,
  input: PropTypes.element,
  value: PropTypes.array,
}

export default RcRangePicker;
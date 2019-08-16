import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Picker from 'rc-calendar/lib/Picker';
import Calendar from 'rc-calendar/lib/Calendar';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import 'rc-calendar/assets/index.css';
import 'react-datepicker/dist/react-datepicker.css';
import './index.scss';
import 'moment/locale/zh-cn';

const formatStr = 'YYYY/MM/DD';

function noop () {}

function format(v) {
  return v ? v.format(formatStr) : '';
}

class RcDatePicker extends React.Component {
  constructor(props) {
    super(props);
    const value = props.value || props.defaultValue;
    let open;
    if ('open' in props) {
      open = props.open;
    } else {
      open = props.defaultOpen;
    }
    this.state = {
      value,
      open,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (format(nextProps.value) !== format(this.state.value)) {
      this.setState({ value: nextProps.value })
    }
    if ('open' in nextProps && nextProps.open !== this.state.open) {
      this.setState({ open: nextProps.open });
    }
  }

  onChange = value => {
    this.setState({ value });
    this.props.onChange(value);
  };

  makeInput = ({ value }) => {
    return React.createElement(
      'div',
      { className: 'picker' },
      React.cloneElement(this.props.input, { value: format(value) })
    )
  }
  setOpen = (open, callback) => {
    if (open === this.state.open) return
    if (!('open' in this.props)) {
      this.setState({ open }, callback)
    }
    this.props.toggleOpen(open);
  }

  render() {
    const { value, open } = this.state;
    return (
      <Picker
        className="rc-date-picker"
        value={value}
        onChange={this.onChange}
        onOpenChange={this.setOpen}
        open={open}
        calendar={
          <Calendar
            innerRef={el => this.calendar = el}
            showWeekNumber={false}
            disabledDate={this.props.disabledDate}
            locale={zhCN}
          />
        }
      >
        { this.makeInput }
      </Picker>
    )
  }
}

RcDatePicker.defaultProps = {
  onChange: noop,
  toggleOpen: noop,
  disabledDate: noop,
  input: <input readOnly />,
  defaultOpen: false,
}

RcDatePicker.propTypes = {
  input: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
  defaultOpen: PropTypes.bool,
  open: PropTypes.bool,
  toggleOpen: PropTypes.func,
  disabledDate: PropTypes.func,
  defaultValue: PropTypes.instanceOf(moment),
  vlaue: PropTypes.instanceOf(moment)
}

export default RcDatePicker;
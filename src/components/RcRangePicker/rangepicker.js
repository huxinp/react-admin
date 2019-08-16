import React, { PropTypes } from 'react';
import Picker from 'rc-calendar/lib/Picker';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import 'rc-calendar/assets/index.css';
import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import './index.css';

import datepng from '../images/date.png';

const Input = styled.input`
  width: 200px;
  height: 32px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(221, 221, 221, 1);
  line-height: 1.5;
  padding: 4px 11px;
  font-size: 14px;
`;

const DatePickerWrapper = styled.div`
  display: inline-block;
`;

const Icon = styled.img`
  position: absolute;
  top: 50%;
  right: 12px;
  /* z-index: 1; */
  width: 14px;
  height: 14px;
  margin-top: -7px;
`;

const DateLabel = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 18px;
  margin-right: 8px;
`;

const formatStr = 'YYYY/MM/DD';

function format(v) {
  return v ? v.format(formatStr) : '';
}

function isValidRange(v) {
  return v && v[0] && v[1];
}

class DateRangePicker extends React.Component {
  state = {
    value: [moment(), moment()],
    hoverValue: []
  };

  componentWillReceiveProps({ value }) {
    if (value !== this.props.value) {
      this.setState({ value });
    }
  }

  onChange = value => {
    this.setState({ value });
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  onHoverChange = hoverValue => {
    this.setState({ hoverValue });
  };

  render() {
    const { hoverValue, value: v, disabled } = this.state;
    const calendar = (
      <RangeCalendar
        className='zm-rc-calendar'
        hoverValue={hoverValue}
        onHoverChange={this.onHoverChange}
        showWeekNumber={false}
        dateInputPlaceholder={['开始日期', '结束日期']}
        disabledDate={this.props.disabledDate}
        locale={zhCN}
      />
    );
    return (
      <div>
        <DateLabel>日期</DateLabel>
        <Picker
          value={v}
          onChange={this.onChange}
          // animation="slide-up"
          calendar={calendar}>
          {({ value }) => {
            return (
              <DatePickerWrapper>
                <div style={{ height: 32, position: 'relative' }}>
                  <Input
                    placeholder='开始日期  ~  结束日期'
                    disabled={disabled}
                    readOnly
                    value={(isValidRange(value) && `${format(value[0])} - ${format(value[1])}`) || ''}
                  />
                  <Icon src={datepng} />
                </div>
              </DatePickerWrapper>
            );
          }}
        </Picker>
      </div>
    );
  }
}

DateRangePicker.propTypes = {
  onChange: PropTypes.func
};

export default DateRangePicker;

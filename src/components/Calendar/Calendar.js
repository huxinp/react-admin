import React, { PropTypes } from 'react';
import DateTable from './date/DateTable';
import DateInput from './date/DateInput';
import CalendarHeader from './calendar/CalendarHeader';
import CalendarFooter from './calendar/CalendarFooter';
import CalendarMixin from './mixin/CalendarMixin';
import CommonMixin from './mixin/CommonMixin';
import locale from './locale/zh_CN';
import moment from 'moment';

function noop() {}

export default class Calendar extends React.PureComponent {
  state = {
    showTimePicker: false,
    value: moment(),
  }
  getFormat = function getFormat(params) {
    
  }
  onClear = function onClear(params) {
    
  }
  onDateInputChange = function onDateInputChange(params) {
    
  }
  render() {
    const {
      showDateInput,
      renderSidebar,
      timePicker,
      locale,
      dateInputPlaceholder,
      disabledDate,
      disabledTime,
      prefixCls,
    } = this.props;
    const { showTimePicker, value, selectedValue, } = this.state;
    return (
      <div>
        { renderSidebar() }
        <div>
          { showDateInput ? (
              <DateInput
                format={this.getFormat()}
                key="date-input"
                value={value}
                locale={locale}
                placeholder={dateInputPlaceholder}
                showClear={true}
                disabledTime={disabledTime}
                disabledDate={disabledDate}
                onClear={this.onClear}
                prefixCls={prefixCls}
                selectedValue={selectedValue}
                onChange={this.onDateInputChange}
              />
            ) : null
          }
          <div>
            <CalendarHeader />
            { timePicker && showTimePicker ? (
                React.cloneElement(timePicker, {})
              ) : null
            }
            <div>
              <DateTable />
              <CalendarFooter />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Calendar.defaultProps = {
  showDateInput: true,
  renderSidebar: function () {
    return null
  },
  showToday: true,
  timePicker: null,
  locale,
  onOk: noop
}
Calendar.propTypes = {
  disabledDate: PropTypes.func,
  disabledTime: PropTypes.any,
  value: PropTypes.object,
  selectedValue: PropTypes.object,
  defaultValue: PropTypes.object,
  className: PropTypes.string,
  locale: PropTypes.object,
  showWeekNumber: PropTypes.bool,
  style: PropTypes.object,
  showToday: PropTypes.bool,
  showDateInput: PropTypes.bool,
  visible: PropTypes.bool,
  onSelect: PropTypes.func,
  onOk: PropTypes.func,
  showOk: PropTypes.bool,
  prefixCls: PropTypes.string,
  onKeyDown: PropTypes.func,
  timePicker: PropTypes.element,
  dateInputPlaceholder: PropTypes.any,
  onClear: PropTypes.func,
  onChange: PropTypes.func,
  renderFooter: PropTypes.func,
  renderSidebar: PropTypes.func
}
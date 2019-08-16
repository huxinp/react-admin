import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { formatDate } from '../Calendar/utils';

export default class DateInput extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      typedDate: false,
      formattedValue: '',
    }
    this.input = null;
  }
  componentWillReceiveProps(nextProps) {
    this.computedFormattedValue(nextProps);
  }
  componentWillUnmount() {
    this.input = null;
  }
  parseTypedDate = e => {
    if ([
      27, // escape
      13 // enter
    ].includes(e.keyCode)) {
      this.input.blur()
    }

    if (this.props.typeable) {
      const typedDate = Date.parse(this.input.value)
      if (!isNaN(typedDate)) {
        this.setState({
          typedDate: this.input.value
        })
        this.props.typedDate(new Date(this.this.input.value))
      }
    }
  }
  inputBlurred = () => {
    const { typeable, clearDate, closeCalendar } = this.props;
    if (typeable && isNaN(Date.parse(this.input.value))) {
      clearDate()
      this.input.value = null
      this.setState({
        typedDate: null,
      })
      closeCalendar();
    }
  }
  computedFormattedValue = ({ selectedDate, format }) => {
    const { typedDate } = this.state;
    let value;
    if (!selectedDate) {
      value = '';
    } else if (typedDate) {
      value = typedDate
    } else {
      value = typeof format === 'function'
        ? format(selectedDate)
        : formatDate(new Date(selectedDate), format)
    }
    this.setState({
      formattedValue: value,
    })
  }
  computedInputClass = () => {
    const { bootstrapStyling, inputClass } = this.props;
    if (bootstrapStyling) {
      if (typeof inputClass === 'string') {
        return [inputClass, 'form-control'].join(' ')
      }
      return {'form-control': true, ...inputClass}
    }
    return inputClass
  }
  render() {
    const {
      selectedDate, inline, typeable, id, name, showCalendar, clearDate,
      openDate, placeholder, clearButton, clearButtonIcon, bootstrapStyling,
      calendarButton, calendarButtonIcon, calendarButtonIconContent, disabled, required,
    } = this.props;
    const { formattedValue } = this.state;
    const inputClassName = this.computedInputClass();
    return (
      <div className="date-input">
        {/* Calendar Button */}
        {
          calendarButton && (
            <span
              className={
                classnames('datepicker__calendar-button', {
                  'input-group-prepend': bootstrapStyling
                })
              }
              onClick={showCalendar}
              style={{
                cursor: disabled ? 'not-allowed' : ''
              }}
            >
              <span className={`${bootstrapStyling ? 'input-group-text' : ''}`}>
                <i className={calendarButtonIcon}>
                  {calendarButtonIconContent}
                  { !calendarButtonIcon && (
                      <span className="default-calendar-btn">
                        <svg t="1562039418253" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2117" width="20" height="20">
                          <path d="M682.666667 113.777778H341.333333v56.888889h341.333334V113.777778zM256 227.555556c17.066667 0 28.444444-11.377778 28.444444-28.444445V28.444444c0-17.066667-11.377778-28.444444-28.444444-28.444444S227.555556 11.377778 227.555556 28.444444v170.666667c0 17.066667 11.377778 28.444444 28.444444 28.444445z m256 369.777777c31.288889 0 56.888889-25.6 56.888889-56.888889s-25.6-56.888889-56.888889-56.888888-56.888889 25.6-56.888889 56.888888 25.6 56.888889 56.888889 56.888889z m256-369.777777c17.066667 0 28.444444-11.377778 28.444444-28.444445V28.444444c0-17.066667-11.377778-28.444444-28.444444-28.444444s-28.444444 11.377778-28.444444 28.444444v170.666667c0 17.066667 11.377778 28.444444 28.444444 28.444445z m142.222222-113.777778h-56.888889v56.888889h28.444445c48.355556 0 85.333333 36.977778 85.333333 85.333333v56.888889H56.888889V256c0-48.355556 36.977778-85.333333 85.333333-85.333333h28.444445V113.777778H113.777778C51.2 113.777778 0 164.977778 0 227.555556v682.666666c0 62.577778 51.2 113.777778 113.777778 113.777778h796.444444c62.577778 0 113.777778-51.2 113.777778-113.777778V227.555556c0-62.577778-51.2-113.777778-113.777778-113.777778z m56.888889 768c0 48.355556-36.977778 85.333333-85.333333 85.333333H142.222222c-48.355556 0-85.333333-36.977778-85.333333-85.333333V369.777778h910.222222v512zM227.555556 853.333333c31.288889 0 56.888889-25.6 56.888888-56.888889s-25.6-56.888889-56.888888-56.888888-56.888889 25.6-56.888889 56.888888 25.6 56.888889 56.888889 56.888889z m284.444444 0c31.288889 0 56.888889-25.6 56.888889-56.888889s-25.6-56.888889-56.888889-56.888888-56.888889 25.6-56.888889 56.888888 25.6 56.888889 56.888889 56.888889zM227.555556 597.333333c31.288889 0 56.888889-25.6 56.888888-56.888889s-25.6-56.888889-56.888888-56.888888-56.888889 25.6-56.888889 56.888888 25.6 56.888889 56.888889 56.888889z m568.888888 0c31.288889 0 56.888889-25.6 56.888889-56.888889s-25.6-56.888889-56.888889-56.888888-56.888889 25.6-56.888888 56.888888 25.6 56.888889 56.888888 56.888889z" fill="#333333" p-id="2118"></path>
                        </svg>
                      </span>
                    )
                  }
                </i>
              </span>
            </span>
          )
        }
        {/* Input */}
        <input
          type={inline ? 'hidden' : 'text'}
          className={classnames('datepicker-input', inputClassName)}
          name={name}
          ref={el => this.input = el}
          id={id}
          value={formattedValue || ''}
          open-date={openDate}
          placeholder={placeholder}
          clear-button={clearButton}
          disabled={disabled}
          required={required}
          readOnly={!typeable}
          onClick={showCalendar}
          onKeyUp={this.parseTypedDate}
          onBlur={this.inputBlurred}
          autoComplete="off"
        />
        {/* Clear Button */}
        {
          clearButton && selectedDate && (
            <span className={classnames('vdp-datepicker__clear-button', {'input-group-append': bootstrapStyling})} onClick={clearDate}>
              <span className={classnames({'input-group-text': bootstrapStyling})}>
                <i className="clearButtonIcon">
                  {!clearButtonIcon && <span>&times;</span>}
                </i>
              </span>
            </span>
          )
        }
      </div>
    )
  }
}
DateInput.defaultProps = {
  inline: false,
  bootstrapStyling: true,
  calendarButton: true,
  selectedDate: null,
  format: 'YYYY-MM-DD',
}
DateInput.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  resetTypedDate: PropTypes.arrayOf([
    PropTypes.instanceOf(Date),
  ]),
  format: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func
  ]),
  translation: PropTypes.object,
  inline: PropTypes.bool,
  id: PropTypes.string,
  name: PropTypes.string,
  openDate: PropTypes.instanceOf(Date),
  placeholder: PropTypes.string,
  inputClass: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  clearButton: PropTypes.bool,
  clearButtonIcon: PropTypes.string,
  calendarButton: PropTypes.bool,
  calendarButtonIcon: PropTypes.string,
  calendarButtonIconContent: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  typeable: PropTypes.bool,
  bootstrapStyling: PropTypes.bool,
  // 事件响应
  showCalendar: PropTypes.func,
  clearDate: PropTypes.func,
  closeCalendar: PropTypes.func,
  typedDate: PropTypes.func,
}
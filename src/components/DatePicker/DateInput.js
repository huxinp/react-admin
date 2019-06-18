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
    }
    closeCalendar();
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
                <i className="calendarButtonIcon">
                  {calendarButtonIconContent}
                  {!calendarButtonIcon && <span>&hellip;</span>}
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
          clearButton && selectedDate (
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
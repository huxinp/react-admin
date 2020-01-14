import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

export default class DateInput extends React.PureComponent {
  constructor(props) {
    super(props);
    const selectedValue = this.props.selectedValue;
    this.state = {
      str: selectedValue && selectedValue.format(this.props.format) || '',
      invalid: false,
    }
    this.onInputChange = this.onInputChange.bind(this);
    this.onClear = this.onClear.bind(this);
    this.getRootDOMNode = this.getRootDOMNode.bind(this);
    this.focus = this.focus.bind(this);
    this.saveDateInput = this.saveDateInput.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const selectedValue = nextProps.selectedValue;
    this.setState({
      str: selectedValue && selectedValue.format(nextProps.format) || '',
      invalid: false
    });
  }
  onInputChange = function onInputChange(event) {
    const str = event.target.value;
    this.setState({ str });
    let value;
    const { disabledDate, format, onChange } = this.props;
    if (str) {
      const parsed = moment(str, format, true);
      if (!parsed.isValid()) {
        this.setState({
          invalid: true,
        });
        return;
      }
      value = this.props.value.clone();
      value
        .year(parsed.year())
        .month(parsed.month())
        .date(parsed.date())
        .hour(parsed.hour())
        .minute(parsed.minute())
        .second(parsed.second());
      if (value && (!disabledDate || !disabledDate(value))) {
        const originalValue = this.props.selectedValue;
        if (originalValue && value) {
          if (!originalValue.isSame(value)) {
            onChange(value);
          }
        } else if (originalValue !== value) {
          onChange(value)
        }
      } else {
        this.setState({
          invalid: true
        });
        return
      }
    } else {
      onChange(null)
    }
    this.setState({ invalid: false });
  }
  onClear = function onClear() {
    this.setState({ str: '' })
    this.props.onClear(null)
  }
  getRootDOMNode = function getRootDOMNode() {
    return ReactDOM.findDOMNode(this);
  }
  focus = function focus() {
    if (this.dateInputInstance) {
      this.dateInputInstance.focus();
    }
  }
  saveDateInput = function saveDateInput(dateInput) {
    // console.log('this', this)
    this.dateInputInstance = dateInput;
  }
  render() {
    const { locale, prefixCls, placeholder, disabled, showClear } = this.props;
    const { invalid, str } = this.state;
    return (
      <div>
        <div>
          <input
            ref={this.saveDateInput}
            value={str}
            disabled={disabled}
            placeholder={placeholder}
            onChange={this.onInputChange}
          />
          { showClear && <a role="button" title={locale.clear} onClick={this.onClear} /> }
        </div>
      </div>
    )
  }
}

DateInput.defaultProps = {

}

DateInput.propTypes = {
  prefixCls: PropTypes.string,
  timePicker: PropTypes.object,
  value: PropTypes.object,
  disabledTime: PropTypes.any,
  format: PropTypes.string,
  locale: PropTypes.object,
  disabledDate: PropTypes.func,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  placeholder: PropTypes.string,
  onSelect: PropTypes.func,
  selectedValue: PropTypes.object
}
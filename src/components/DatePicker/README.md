日期选择组件 

```js
DatePicker.propTypes = {
  // props attribute
  value: function(props, propName, componentName) {
    const val = props[propName];
    if (!validateDateInput(val)) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },
  name: PropTypes.string,
  id: PropTypes.string,
  format: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  openDate: function(props, propName, componentName) {
    const val = props[propName];
    if (!validateDateInput(val)) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },
  dayCellContent: PropTypes.func,
  fullMonthName: PropTypes.bool,
  disabledDates: PropTypes.object,
  highlighted: PropTypes.object,
  placeholder: PropTypes.string,
  inline: PropTypes.bool,
  calendarClass: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  inputClass: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  wrapperClass: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  mondayFirst: PropTypes.bool,
  clearButton: PropTypes.bool,
  clearButtonIcon: PropTypes.string,
  calendarButton: PropTypes.bool,
  calendarButtonIcon: PropTypes.string,
  calendarButtonIconContent: PropTypes.string,
  bootstrapStyling: PropTypes.bool,
  initialView: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  typeable: PropTypes.bool,
  useUtc: PropTypes.bool,
  minimumView: PropTypes.string,
  maximumView: PropTypes.string,
  // React Component
  Header: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  Cell: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  HeaderCell: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  Tip: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  // 事件外传
  onChangeMonth: PropTypes.func,
  onChangeYear: PropTypes.func,
  onChangeDecade: PropTypes.func,
  onSelectDate: PropTypes.func,
  onSelectedDisabled: PropTypes.func,
  onSelected: PropTypes.func,
  onInput: PropTypes.func,
}
```
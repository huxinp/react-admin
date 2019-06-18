import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import '../index.scss';

import { loop } from '../utils';

export default class Input extends React.PureComponent {
  constructor(props) {
    super(props);
    const checked = 'checked' in props ? props.checked : props.defaultChecked;
    this.state = {
      checked,
    }
  }
  componentWillReceiveProps(props) {
    if ('checked' in props) {
      this.setState({ checked: props.checked })
    }
    if ('indeterminate' in props) {
      this.input && (this.input.indeterminate = props.indeterminate);
    }
  }
  componentDidMount() {
    if ('indeterminate' in this.props) {
      this.input && (this.input.indeterminate = this.props.indeterminate);
    }
  }
  changeHandle = e => {
    this.setState({
      checked: e.target.checked,
    })
    this.props.onChange({
      checked: e.target.checked,
      type: this.props.type,
      value: this.props.value,
      target: {
        ...this.props,
        checked: e.target.checked, // 覆盖 props 当中的 checked
      },
      nativeEvent: e.nativeEvent,
      stopPropagation() {
        e.stopPropagation();
      },
      preventDefault() {
        e.preventDefault();
      },
    })
  }
  render() {
    const {
      type,
      name,
      value,
      className,
      id,
      onBlur,
      onFocus,
      tabIndex,
      disabled,
      prefixCls,
      autoFocus,
      readOnly,
      indeterminate,
    } = this.props;
    const { checked } = this.state;
    const stringClassName = classnames(prefixCls, `${prefixCls}-${type}`, className, {
      [`${prefixCls}-${type}-checked`]: checked,
      [`${prefixCls}-${type}-disabled`]: disabled,
      [`${prefixCls}-${type}-indeterminate`]: indeterminate,
    });
    const iconClassName = classnames(`${prefixCls}-${type}-icon`, `${prefixCls}-icon`, {
      [`${className}-icon`]: !!className,
    })
    return (
      <span className={stringClassName}>
        <span className={iconClassName}></span>
        <input
          type={type}
          name={name}
          className={`${prefixCls}-input`}
          id={id}
          disabled={disabled}
          checked={!!checked}
          value={value}
          tabIndex={tabIndex}
          onBlur={onBlur}
          onClick={this.onClick}
          onFocus={onFocus}
          onChange={this.changeHandle}
          autoFocus={autoFocus}
          readOnly={readOnly}
          ref={el => this.input = el}
        />
      </span>
    )
  }
}
Input.defaultProps = {
  prefixCls: 'input__check',
  type: 'checkbox',
  className: '',
  onChange: loop,
  onBlur: loop,
  onFocus: loop,
  onClick: loop,
}
Input.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  defaultChecked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  checked: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf(['radio', 'checkbox']),
  readOnly: PropTypes.bool,
  autoFocus: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onClick: PropTypes.func,
  indeterminate: PropTypes.bool,
}
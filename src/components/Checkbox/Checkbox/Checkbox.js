import React from 'react';
import Input from '../Input';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import '../index.scss';

export default class Checkbox extends React.PureComponent {
  render() {
    const { children, className, prefixCls, disabled, ...otherProps } = this.props;
    const stringClassName = classnames(`${prefixCls}-wrapper`, {
      [`${className}-wrapper`]: !!className,
      [`${className}-wrapper-disabled`]: !!className && !!disabled,
      [`${prefixCls}-wrapper-disabled`]: !!disabled,
    })
    return (
      <label className={stringClassName}>
        <Input {...otherProps} disabled={disabled} prefixCls={prefixCls} className={className} />
        <span>{children}</span>
      </label>
    )
  }
}
Checkbox.defaultProps = {
  prefixCls: 'input__check',
  className: '',
}
Checkbox.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
}
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Input from '../Input';
import '../index.scss';

export default class Radio extends React.PureComponent {
  render() {
    const { children, className, prefixCls, ...otherProps } = this.props;
    const stringClassName = classnames(`${prefixCls}-wrapper`, {
      [`${className}-wrapper`]: !!className
    })
    return (
      <label className={stringClassName}>
        <Input type="radio" {...otherProps} prefixCls={prefixCls} className={className} />
        <span>{children}</span>
      </label>
    )
  }
}
Radio.defaultProps = {
  prefixCls: 'input__check',
  className: '',
}
Radio.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
}
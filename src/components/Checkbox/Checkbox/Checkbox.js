import React from 'react';
import Input from '../Input';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Group from '../Group';
import '../index.scss';

export default class Checkbox extends React.PureComponent {
  render() {
    const { children, className, prefixCls, ...otherProps } = this.props;
    const stringClassName = classnames(`${prefixCls}-wrapper`, {
      [`${className}-wrapper`]: !!className
    })
    return (
      <label className={stringClassName}>
        <Input {...otherProps} prefixCls={prefixCls} className={className} />
        <span>{children}</span>
      </label>
    )
  }
}
Checkbox.Group = function (props) {
  return <Group type="checkbox" {...props} />
};
Checkbox.defaultProps = {
  prefixCls: 'input__check',
  className: '',
}
Checkbox.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
}
import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../Checkbox/Checkbox';
import '../index.scss';
import { loop } from '../utils';

export default class Group extends React.PureComponent {
  constructor(props) {
    super(props);
    const value = 'defaultValue' in props ? props.defaultValue : [];
    this.state = {
      value: props.type === 'radio' ? [value[0]] : value,
    }
  }
  componentWillReceiveProps(nextProps) {
    if ('defaultValue' in nextProps) {
      this.setState({
        value: nextProps.type === 'radio' ? [nextProps.defaultValue[0]] : nextProps.defaultValue,
      })
    }
  }
  handleChange = e => {
    const { type } = this.props;
    let value = [...this.state.value];
    const targetVal = e.target.value;
    if (type === 'radio') {     // 单选
      value = [targetVal]
    } else {                    // 多选
      if (e.target.checked) {   // 勾选
        value.push(targetVal);
      } else {                  // 取消勾选
        const index = value.indexOf(targetVal);
        value.splice(index, 1);
      }
    }
    this.setState({ value })
    this.props.onChange(value);
  }
  renderChildren = () => {
    const { children, name } = this.props;
    const { value } = this.state;
    return React.Children.map(children, child => {
      return React.cloneElement(child, { name, checked: value.includes(child.props.value),  onChange: this.handleChange })
    })
  }
  renderData = () => {
    const { options, name, type } = this.props;
    const { value } = this.state;
    return options.map(it => {
      const { checked, ...otherProps } = it;
      return (
        <Checkbox
          name={name}
          type={type}
          key={it.value}
          onChange={this.handleChange}
          {...otherProps}
          checked={value.includes(it.value)}
        >{it.label}</Checkbox>
      )
    })
  }
  render () {
    const { className, children, prefixCls } = this.props;
    return (
      <div className={`${prefixCls}__group ${className}`}>
        {
          children ? this.renderChildren() : this.renderData()
        }
      </div>
    )
  }
}
Group.defaultProps = {
  prefixCls: 'input__check',
  className: '',
  onChange: loop,
}
Group.propTypes = {
  prefixCls: PropTypes.string,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf(['checkbox', 'radio']),
  className: PropTypes.string,
  onChange: PropTypes.func,
  children: PropTypes.arrayOf(PropTypes.element),
  defaultValue: PropTypes.arrayOf(PropTypes.any),
  checkedList: PropTypes.arrayOf(PropTypes.any),
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.any,
    value: PropTypes.any,
    disabled: PropTypes.bool,
    indeterminate: PropTypes.bool,
  }))
}
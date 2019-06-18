import React from 'react';
import PropTypes from 'prop-types';
import '../index.scss';
import { loop, deleteByArray, compareArray } from '../utils';

export default class Group extends React.PureComponent {
  constructor(props) {
    super(props);
    const value = 'defaultValue' in props ? props.defaultValue : [];
    this.state = {
      value: value,
    }
  }
  componentWillReceiveProps(nextProps) {
    if ('defaultValue' in nextProps) {
      this.setState({
        value: nextProps.defaultValue,
      })
    }
  }
  handleChange = (e, data) => {
    console.log('g', 'e', e, 'data', data)
    const { nodeValues } = this.props;
    if (!data) {   // 多选组 (末级节点 | 中间节点直接点击)
      let value = [...this.state.value];   // 末级节点
      const targetVal = e.target.value;
      if (e.checked) {                     // 勾选
        value.push(targetVal);
      } else {                             // 取消勾选
        const index = value.indexOf(targetVal);
        value.splice(index, 1);
      }
      this.setState({ value })
      console.log('g', '多选组', 'c', 'e', e, 'data', { nodeValues, checkedList: value})
      this.props.onChange(e, { nodeValues, checkedList: value});
    } else { // 全选组
      console.log('g', 'p', 'e', e, 'data', data)
      let value = [...this.state.value];
      if (data.checkedList.length === 0) { // 取消(全部)勾选
        value = deleteByArray(value, data.nodeValues);
      } else if (compareArray(data.checkedList, data.nodeValues)) { // 勾选(全部)
        value = value.concat(data.checkedList);
      } else {                              // 半选
        console.log('g', '半选', 'e', e, 'data', data);
        value = deleteByArray(value, data.nodeValues);
        value = [...new Set(value.concat(data.checkedList))];
      }
      value = [...new Set(value)]
      this.setState({ value });
      this.props.onChange(e, { nodeValues, checkedList: value });
    }
  }
  renderChildren = () => {
    const { children, name, prefixCls } = this.props;
    const { value } = this.state;
    return React.Children.map(children, child => {
      console.log('g', 'value', value, child.props.value)
      return React.cloneElement(child, { name, prefixCls, checked: value.includes(child.props.value),  onChange: this.handleChange })
    })
  }
  render () {
    const { className, prefixCls } = this.props;
    return (
      <div className={`${prefixCls}-group ${className}`}>
        { this.renderChildren() }
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
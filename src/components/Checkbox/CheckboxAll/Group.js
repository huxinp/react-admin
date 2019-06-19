import React from 'react';
import PropTypes from 'prop-types';
import '../index.scss';
import { loop, deleteByArray, compareArray, parseArr2Obj } from '../utils';

export default class Group extends React.PureComponent {
  constructor(props) {
    super(props);
    const groupValue = 'defaultValue' in props ? props.defaultValue : [];
    this.state = {
      groupValue,
      groupData: {},
    }
  }
  componentWillReceiveProps(nextProps) {
    if ('defaultValue' in nextProps) {
      this.setState({
        groupValue: nextProps.defaultValue,
      })
    }
  }
  handleChange = (e, data) => {
    const { nodeValues } = this.props;
    let groupValue = [...this.state.groupValue];
    if (data) {   // 全选组  |  中间节点直接点击
      console.log('group', 'data', data.checkedData)
      if (data.checkedList.length === 0) { // 取消(全部)勾选
        groupValue = deleteByArray(groupValue, data.nodeValues);
      } else if (compareArray(data.checkedList, data.nodeValues)) { // 勾选(全部)
        groupValue = groupValue.concat(data.checkedList);
        console.log(this.state.groupValue, data.checkedList, groupValue)
      } else {                              // 半选
        groupValue = deleteByArray(groupValue, data.nodeValues);
        groupValue = [...new Set(groupValue.concat(data.checkedList))];
      }
      groupValue = [...new Set(groupValue)]
      data.checkedList = groupValue;
      data.nodeValues = nodeValues;
    } else {   // 多选组 末级节点
      console.log('group', '!data')
      const targetVal = e.target.value;
      if (e.checked) {                     // 勾选
        groupValue.push(targetVal);
      } else {                             // 取消勾选
        const index = groupValue.indexOf(targetVal);
        groupValue.splice(index, 1);
      }
      groupValue = [...new Set(groupValue)];
      const checkedData = {
        ...parseArr2Obj(groupValue),
        nodeValues,
        checkedList: groupValue,
      };
      console.log('value', targetVal, 'data', this.state.groupData, 'checkedData', checkedData)
      console.log('group', '!data', 'e', e, 'checkedData', {...checkedData})
      data = {
        nodeValues,
        checkedList: groupValue,
        checkedData,
      }
    }
    this.setState({ groupValue, groupData: {...data.checkedData} });
    this.props.onChange(e, data);
  }
  renderChildren = () => {
    const { children, name, prefixCls } = this.props;
    const { groupValue } = this.state;
    return React.Children.map(children, child => {
      return React.cloneElement(child, { name, prefixCls, checked: groupValue.includes(child.props.value),  onChange: this.handleChange })
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
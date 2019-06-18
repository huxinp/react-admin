import React from 'react';
import PropTypes from 'prop-types';
import classanmes from 'classnames';
import Checkbox from '../Checkbox';
import Group from './Group';
import { deepMap, compareArray } from '../utils';
import { loop } from '../utils';
export default class CheckboxAll extends React.PureComponent {
  constructor(props) {
    super(props);
    const nodeValues = deepMap(props.options);
    this.state = {
      checked: false,
      value: [],
      indeterminate: false, // true 时 为半选
      nodeValues,
    }
  }
  componentWillReceiveProps(nextProps) {
    if ('defaultValue' in nextProps) {
      this.init(nextProps);
    }
  }
  componentDidMount() {
    this.init(this.props);
  }
  init = props => { // 初始化当前 半选 全选 或者是 未选
    const { nodeValues } = this.state;
    const defaultValue = props.defaultValue || [];
    let checked = true;
    let unChecked = true;
    nodeValues.forEach(item => {
      if (unChecked && defaultValue.includes(item)) {
        unChecked = false;
      }
      if (checked && !defaultValue.includes(item)) {
        checked = false;
      }
    })
    this.setState({
      checked,
      value: defaultValue,
      indeterminate: !checked && !unChecked,
    })
    console.log('init', defaultValue)
  }
  parentChange = (e, data) => {
    const { onChange } = this.props;
    let { checked, indeterminate, value, nodeValues } = this.state;
    let list = [...value];
    if (e.checked) { // 全选
      console.log('p', '全选')
      checked = true;
      list = nodeValues;
      indeterminate = false;
      console.log('p', '全选', 'list', list);
    } else if (!e.target.checked && !e.target.indeterminate) { // 全不选
      console.log('p', '全不选')
      checked = false;
      list = [];
      indeterminate = false;
    } else {
      console.log('p', '半选?')
    }
    this.setState({
      checked,
      indeterminate,
      value: list,
    });
    console.log('p', 'e', e, 'data', { checkedList: list, nodeValues })
    onChange(e, { checkedList: list, nodeValues })
  }
  childChange = (e, data) => {
    let { checked, indeterminate } = this.state;
    if (data.checkedList.length === 0) { // 取消勾选
      console.log('c', '取消勾选', 'e', e, 'data', data);
      checked = false;
      indeterminate = false;
    } else if (compareArray(data.checkedList, data.nodeValues)) { // 勾选
      console.log('c', '勾选', 'e', e, 'data', data);
      checked = true;
      indeterminate = false;
    } else { // 半选
      console.log('c', '半选', 'e', e, 'data', data);
      checked = false;
      indeterminate = true;
    }
    this.setState({
      checked,
      indeterminate,
      value: data.checkedList,
    })
    this.props.onChange(e, data)
  }
  render () {
    const { options, prefixCls, className } = this.props;
    const { checked, value, indeterminate, nodeValues } = this.state;
    const stringClassnameGroup = classanmes(className, `${prefixCls}-checkbox-all-group`)
    const stringClassnameGroupInner = classanmes(`${prefixCls}-checkbox-all-group-inner`, {
      [`${className}-inner`]: className,
    })
    console.log(options.value, 'checked', checked, 'indeterminate', indeterminate)
    /*
      if (Object.prototype.toString.call(options) === '[object Array]') {
        return (
          <Group onChange={this.childChange} defaultValue={value} nodeValues={nodeValues}>
            {
              options.children.map(item => {
                if (item.children) {
                  return <CheckboxAll key={item.value} options={item} className={className} prefixCls={prefixCls} />
                } else {
                  return <Checkbox key={item.value} value={item.value}>{item.label}</Checkbox>
                }
              })
            }
          </Group>
        )
      }
    */
    return (
      <div className={stringClassnameGroup}>
        <Checkbox onChange={this.parentChange} checked={checked} prefixCls={prefixCls} indeterminate={indeterminate} value={options.value}>{options.label}</Checkbox>
        <div className={stringClassnameGroupInner}>
          <Group onChange={this.childChange} defaultValue={value} nodeValues={nodeValues}>
            {
              options.children.map(item => {
                if (item.children) {
                  return <CheckboxAll key={item.value} options={item} value={item.value} defaultValue={value} className={className} prefixCls={prefixCls} />
                } else {
                  return <Checkbox key={item.value} prefixCls={prefixCls} value={item.value}>{item.label}</Checkbox>
                }
              })
            }
          </Group>
        </div>
      </div>
    )
  }
}
var option = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  children: PropTypes.arrayOf(option)
});
CheckboxAll.defaultProps = {
  prefixCls: 'input__check',
  className: '',
  onChange: loop,
}
var e = PropTypes.shape({
  nodeValues: PropTypes.array,
  checkedList: PropTypes.array,
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  value: PropTypes.string,
  type: 'checkedAll',
})
CheckboxAll.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  defaultValue: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  // options: option,
}
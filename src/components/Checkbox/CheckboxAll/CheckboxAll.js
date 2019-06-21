import React from 'react';
import PropTypes from 'prop-types';
import classanmes from 'classnames';
import Checkbox from '../Checkbox';
import Group from './Group';
import { deepMap, compareArray, parseArr2Obj } from '../utils';
import { loop } from '../utils';
export default class CheckboxAll extends React.PureComponent {
  constructor(props) {
    super(props);
    const nodeValues = deepMap(props.options);
    this.state = {
      checked: false,
      indexValue: [],
      indeterminate: false, // true 时 为半选
      nodeValues,
      indexData: {},
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
    });
    this.setState({
      checked,
      indexValue: defaultValue,
      indeterminate: !checked && !unChecked,
    });
  }
  handleChange = (e, data) => {
    const { onChange, options } = this.props;
    let { checked, indeterminate, indexValue, nodeValues } = this.state;
    if (data) { // 子节点传递上来的
      console.log('index', 'data', data.checkedData)
      if (data.checkedList.length === 0) { // 取消勾选
        checked = false;
        indeterminate = false;
      } else if (compareArray(data.checkedList, data.nodeValues)) { // 勾选
        checked = true;
        indeterminate = false;
      } else { // 半选
        checked = false;
        indeterminate = true;
      }
      console.log('index', 'data', 'e', e,  data.checkedData)
    } else { // 中间节点直接操作
      console.log('index', '!data')
      let list = [...indexValue];
      if (e.checked) { // 全选
        checked = true;
        list = nodeValues;
        indeterminate = false;
      } else if (!e.target.checked && !e.target.indeterminate) { // 全不选
        checked = false;
        list = [];
        indeterminate = false;
      } else {
        console.log('p', '半选?')
      }
      const checkedData = {
        ...parseArr2Obj(list),
        nodeValues,
        checkedList: list,
      };
      data = { checkedList: list, nodeValues, checkedData };
    }
    const checkedData = {
      [options.value]: {
        checked,
        indeterminate,
        nodeValues,
        checkedList: data.checkedList,
        checkedData: {...data.checkedData},
        value: options.value
      }
    }
    this.setState({
      checked,
      indeterminate,
      indexValue: data.checkedList,
      data: {...checkedData},
    })

    data.checkedData = checkedData;
    onChange(e, data)
  }
  render () {
    const { options, prefixCls, className } = this.props;
    const { checked, indexValue, indeterminate, nodeValues } = this.state;
    const stringClassnameGroup = classanmes(className, `${prefixCls}-checkbox-all-group`)
    const stringClassnameGroupInner = classanmes(`${prefixCls}-checkbox-all-group-inner`, {
      [`${className}-inner`]: className,
    });
    /*
      if (Object.prototype.toString.call(options) === '[object Array]') {
        return (
          <Group onChange={this.childChange} defaultValue={indexValue} nodeValues={nodeValues}>
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
        <Checkbox onChange={this.handleChange} checked={checked} prefixCls={prefixCls} indeterminate={indeterminate} value={options.value}>{options.label}</Checkbox>
        <div className={stringClassnameGroupInner}>
          <Group onChange={this.handleChange} defaultValue={indexValue} nodeValues={nodeValues}>
            {
              options.children.map(item => {
                if (item.children) {
                  return <CheckboxAll key={item.value} options={item} value={item.value} defaultValue={indexValue} className={className} prefixCls={prefixCls} />
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
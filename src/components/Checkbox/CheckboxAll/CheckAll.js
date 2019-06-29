import React from 'react';
import PropTypes from 'prop-types';
import classanmes from 'classnames';
import Checkbox from '../Checkbox';
import { loop, checkedAllFn } from '../utils';

function ChildNode (props) {
  const { prefixCls, inputPrefixCls, key, ...otherProps } = props;
  return (
    <div className={`${prefixCls}-child-node`}>
      <div className={`${prefixCls}-child-node-icon`}></div>
      <Checkbox {...otherProps} prefixCls={inputPrefixCls} />
    </div>
  )
}
function ParentNode (props) {
  const { prefixCls, inputPrefixCls, key, openChildHandle, disableParentNode, openState, ...otherProps } = props;
  return (
    <div className={`${prefixCls}-parent-node`}>
      <div className={`${prefixCls}-parent-node-icon ${openState ? `${prefixCls}-parent-node-icon-open` : ''}`} onClick={openChildHandle}></div>
      <Checkbox {...otherProps} prefixCls={inputPrefixCls} disabled={disableParentNode} />
    </div>
  )
}
class Group extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkedData: [], // 选择的后代节点
    }
  }
  componentWillReceiveProps(nextProps) {
    this.initCheckedDatas(nextProps);
  }
  componentDidMount() {
    this.initChildValues(this.props);
    this.initCheckedDatas(this.props);
  }
  initChildValues = props => {
    if ('children' in props) {
      let values = [];
      React.Children.map(props.children, child => {
        values.push(child.props[props.translateValue])
      });
      this.setState({ childValues: values });
    }
  }
  initCheckedDatas = props => {
    if ('checkedDatas' in props) {
      this.setState({
        checkedData: props.checkedDatas || []
      });
    }
  }
  changeHandle = (e, data) => {
    const { onChange, translateValue } = this.props;
    const { checkedData } = this.state;
    if (data) {                       // 全选  非末级节点
      let tempData = [...checkedData];
      let index;
      let oldChecked;
      tempData.forEach((item, i) => {
        if (item[translateValue] === data[translateValue]) {
          oldChecked = item;
          index = i;
        }
      });
      if (oldChecked) {
        let newChecked = Object.assign({}, oldChecked, data);
        tempData.splice(index, 1);
        tempData.push(newChecked);
      } else {
        tempData.push(data);
      }
      this.setState({
        checkedData: tempData,
      });
      onChange(e, tempData);
    } else {                          // 多选  末级节点
      let tempData = [...checkedData];
      if (e.checked) {                // 勾选
        tempData.push({
          ...e.target.options,
          checked: e.checked,
          indeterminate: false,
        })
      } else {                        // 取消勾选
        let temp = [];
        tempData.forEach(item => {
          if (item[translateValue] !== e.value) {
            temp.push(item);
          }
        })
        tempData = temp;
      }
      this.setState({
        checkedData: tempData,
      });
      onChange(e, tempData);
    }
  }
  renderChildren = () => {
    const { prefixCls, inputPrefixCls, disableParentNode, openValues, translateValue, translateLabel } = this.props;
    const { checkedData } = this.state;
    const defaultProps = { prefixCls, inputPrefixCls, disableParentNode, openValues, translateValue, translateLabel };
    return React.Children.map(this.props.children, child => {
      const state = checkedData.find(item => item[translateValue] === (child.props.value || child.props.options[translateValue])) || {};
      const { checked = false, indeterminate = false, children = [] } = state;
      return React.cloneElement(child, {
        checked,
        indeterminate,
        checkedDatas: children,
        onChange: this.changeHandle,
        ...defaultProps,
      });
    })
  }

  render() {
    return <div>{ this.renderChildren() }</div>
  }
}
export default class CheckAll extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      /*
        childValues: [],          // 子节点的值
        checkedData: {            // 选择的后代节点
          checked: false,             // 是否选中
          indeterminate: true,        // 是否半选
          children: [                 // 按选择顺序 push 方便 实现分组和排序
            { value: 'aa', checked: true },
          ]
        },
        openChild: true,          // 是否展开子节点
      */
      childValues: [],
      checkedData: {
        checked: false,
        indeterminate: false,
        children: [],
      },
      openChild: false, 
    }
  }
  componentWillReceiveProps(nextProps) {
    this.init(nextProps);
  }
  componentDidMount () {
    const { openValues, options, translateValue } = this.props;
    this.init(this.props);
    if (openValues) {
      this.setState({
        openChild: openValues.includes(options[translateValue])
      })
    }
  }
  init = props => {
    const checkedData = {}
    if ('checked' in props) {
      checkedData.checked = props.checked;
    }
    if ('indeterminate' in props) {
      checkedData.indeterminate = props.indeterminate;
    }
    if ('checkedDatas' in props) {
      checkedData.children = props.checkedDatas || [];
    }
    this.setState({
      childValues: props.options.children.map(item => item[props.translateValue]),
      checkedData,
    });
  }
  openChildHandle = () => {
    this.setState({
      openChild: !this.state.openChild,
    })
  }
  changeHandle = (e, data) => {
    const { onChange, options, translateValue } = this.props;
    const { childValues } = this.state;
    if (data) {    // 子组件传递上来的
      const checkedChild = []; // 勾选的子组件
      const indeterChild = []; // 半选的子组件
      data.forEach(item => {
        if (item.checked) {
          checkedChild.push(item[translateValue]);
        }
        if (item.indeterminate) {
          indeterChild.push(item[translateValue]);
        }
      })
      const checked = checkedChild.length === childValues.length;
      const indeterminate = ( // 是否半选
          checkedChild.length &&                      // 子组件有选中的, 
          checkedChild.length !== childValues.length  // 但不是全部都选中了
        ) || (!!indeterChild.length);                 // 或者有子组件是半选的
      const tempData = {
        ...options,
        checked,
        indeterminate,
        children: [...data],
      }
      this.setState({
        checkedData: tempData,
      })
      onChange(e, tempData)
    } else {       // 父节点直接点击
      const tempData = checkedAllFn(options, translateValue, e.checked);
      this.setState({
        checkedData: tempData,
      })
      onChange(e, tempData)
    }
  }
  render() {
    const { options, prefixCls, inputPrefixCls, disableParentNode, openValues, translateValue, translateLabel } = this.props;
    const {
      checkedData: {
        checked,
        indeterminate,
        children,
      },
      openChild,
    } = this.state;
    const stringClassnameGroup = classanmes(`${prefixCls}-group`)
    const stringClassnameGroupInner = classanmes({
      [`${prefixCls}-group-inner`]: true,
      [`${prefixCls}-group-inner-hide`]: !openChild,
    });
    const defaultProps = { prefixCls, inputPrefixCls, disableParentNode, openValues, translateValue, translateLabel };
    const nodeProps = {...options, children: undefined};
    return (
      <div className={stringClassnameGroup}>
        <ParentNode
          openChildHandle={this.openChildHandle}
          onChange={this.changeHandle}
          openState={openChild}
          prefixCls={prefixCls}
          checked={checked}
          indeterminate={indeterminate}
          value={options[translateValue]}
          {...defaultProps}
          {...nodeProps}
        >
          { options[translateLabel] }
        </ParentNode>
        <div className={stringClassnameGroupInner}>
          <Group onChange={this.changeHandle} checkedDatas={children} {...defaultProps}>
            {
              options.children.map(item => {
                if (item.children) {
                  return <CheckAll key={item[translateValue]} options={item} value={item[translateValue]} />
                } else {
                  return <ChildNode key={item[translateValue]} options={item} value={item[translateValue]} disabled={item.disabled}>{item[translateLabel]}</ChildNode>
                }
              })
            }
          </Group>
        </div>
      </div>
    )
  }
}
CheckAll.Group = Group;

CheckAll.propTypes = {
  prefixCls: PropTypes.string,
  inputPrefixCls: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  disableParentNode: PropTypes.bool,   // 非末级节点不能点击
  translateValue: PropTypes.string,
  translateLabel: PropTypes.string,
  // checkedDatas
  // options: PropTypes.oneOfType([options, PropTypes.arrayOf(options)])
}
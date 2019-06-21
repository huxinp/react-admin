import React from 'react';
import PropTypes from 'prop-types';
import CheckAll from './CheckAll';
import { loop } from '../utils';

export default class CheckboxAll extends React.PureComponent {
  constructor(props) {
    super(props);
    const isarray = props.children || (props.options && Object.prototype.toString.call(props.options) === '[object Array]');
    this.state = {
      isarray,
      checkedDatas: [],
    }
  }
  /*
  changeHandle = (e, data) => {
    const { onChange } = this.props;
    const { checkedData } = this.state;
    if (data) {                       // 全选  非末级节点
      let tempData = [...checkedData];
      let index;
      let oldChecked;
      tempData.forEach((item, i) => {
        if (item.value === data.value) {
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
          value: e.value,
          checked: e.checked,
          indeterminate: false,
        })
      } else {                        // 取消勾选
        let temp = [];
        tempData.forEach(item => {
          if (item.value !== e.value) {
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
  */
  changeHandle = (e, data) => {
    const { onChange, options } = this.props;
    const { isarray } = this.state;
    if (options && isarray) { // options 是数组
      this.setState({
        checkedDatas: [...data],
      })
    }
    onChange(e, data);
  }

  renderChildren = () => {
    const { options } = this.props;
    return options.map(option => {
      return <CheckAll key={option.value} options={option} />
    })
  }

  render() {
    const { options, children } = this.props;
    const { isarray, checkedDatas } = this.state;
    if (isarray) {
      if (children) { // 手动出入子组件
        return (
          <CheckAll.Group onChange={this.changeHandle}>
            { children }
          </CheckAll.Group>
        )
      } else {        // options 为数组
        return (
          <CheckAll.Group onChange={this.changeHandle} checkedDatas={checkedDatas}>
            { this.renderChildren() }
          </CheckAll.Group>
        )
      }
    } else {          // options 为对象
      return <CheckAll options={options} onChange={this.changeHandle} />
    }
  }
};


var options;
options = PropTypes.shape({
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  children: PropTypes.arrayOf(options)
});
CheckboxAll.defaultProps = {
  prefixCls: 'input__check',
  onChange: loop,
}

var checkedData = PropTypes.shape({
  value: PropTypes.string,
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  children: PropTypes.arrayOf(checkedData)
})
var eventParam = PropTypes.shape({
  checked: PropTypes.bool,
  value: PropTypes.any,
  type: PropTypes.oneOf(['checkbox', 'checkall']),
  target: PropTypes.object,
  nativeEvent: PropTypes.object,
  stopPropagation: PropTypes.func,
  preventDefault: PropTypes.func,
})
var dataParam = PropTypes.shape({
  checkedData,
})
CheckboxAll.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  // options: PropTypes.oneOfType([options, PropTypes.arrayOf(options)])
}
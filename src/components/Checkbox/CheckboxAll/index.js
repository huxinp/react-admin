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
  componentDidMount() {
    this.init(this.props);
  }
  init = props => {
    // TODO: 外部可传入选中的数据(默认选中), 可以是 checkedData 的格式,  也可以是 value 的数组  默认打开的列
  }
  changeHandle = (e, data) => {
    const { onChange, options } = this.props;
    const { isarray } = this.state;
    if (options && isarray) { // options 是数组
      this.setState({
        checkedDatas: [...data],
      })
    }
    // TODO: 这里向外导出数据多样化,  除了 checkedDatas 格式外, 还要 选中的 value 组成的 数组  以及包含半选的 value的数组
    onChange(e, data);
  }

  renderChildren = () => {
    const { options } = this.props;
    return options.map(option => {
      return <CheckAll key={option.value} options={option} />
    })
  }

  render() {
    const { options, children, prefixCls, inputPrefixCls, disableParentNode } = this.props;
    const { isarray, checkedDatas } = this.state;
    const defaultProps = { prefixCls, inputPrefixCls, disableParentNode };
    console.log('defaultProps', defaultProps)
    if (isarray) {
      if (children) { // 手动出入子组件
        console.log('index children')
        return (
          <CheckAll.Group onChange={this.changeHandle} {...defaultProps}>
            { children }
          </CheckAll.Group>
        )
      } else {        // options 为数组
        console.log('index renderChildren');
        return (
          <CheckAll.Group onChange={this.changeHandle} checkedDatas={checkedDatas} {...defaultProps}>
            { this.renderChildren() }
          </CheckAll.Group>
        )
      }
    } else {          // options 为对象
      return <CheckAll options={options} onChange={this.changeHandle} {...defaultProps} />
    }
  }
};

CheckboxAll.defaultProps = {
  prefixCls: 'check__all',
  inputPrefixCls: 'input__check',
  disableParentNode: false,
  onChange: loop,
}
CheckboxAll.propTypes = {
  prefixCls: PropTypes.string,
  inputPrefixCls: PropTypes.string,
  disableParentNode: PropTypes.bool,   // 父节点不能点击,   只能点击末级节点
  onChange: PropTypes.func,
  // options: PropTypes.oneOfType([options, PropTypes.arrayOf(options)])
}
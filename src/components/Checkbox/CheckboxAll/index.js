import React from 'react';
import PropTypes from 'prop-types';
import CheckAll from './CheckAll';
import { loop, parseObj2Array } from '../utils';

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
    // this.init(this.props);
  }
  changeHandle = (e, data) => {
    const { onChange, options } = this.props;
    const { isarray } = this.state;
    if (options && isarray) { // options 是数组
      this.setState({
        checkedDatas: [...data],
      })
    }
    const list = parseObj2Array(data, [], []);
    onChange(e, data, ...list);
  }

  renderChildren = () => {
    const { options } = this.props;
    return options.map(option => {
      return <CheckAll key={option.value} options={option} />
    })
  }

  render() {
    const { options, children, prefixCls, inputPrefixCls, disableParentNode, openValues } = this.props;
    const { isarray, checkedDatas } = this.state;
    const defaultProps = { prefixCls, inputPrefixCls, disableParentNode, openValues };
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
  openValues: PropTypes.array,
  // options: PropTypes.oneOfType([options, PropTypes.arrayOf(options)])
}
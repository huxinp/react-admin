import React, { PropTypes } from 'react';
import Immutable, { fromJS } from 'immutable';
import { parseOption, toString } from './utils';

import './index.scss';

export default class LineScrollSelector extends React.PureComponent {
  state = {
    offsetX: 0,
    wrapWidth: 0,
    innerWidth: 0,
    itemsWidth: [],
    leftIndex: 0,
    showArrowBtn: true,
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.options !== this.props.options) {
      this.init(nextProps);
    }
  }
  componentDidMount() {
    this.init(this.props)
  }
  componentWillUnmount() {
    this.innerElement = null;
    clearTimeout(this.moveTimer)
    this.moveTimer = null;
  }
  selectHandle = option => {
    const { onSelect } = this.props;
    onSelect(option);
  }
  // 初始化 
  init = props => { // 定位当前选择的内容并移动过去
    const { options, selected, customValue } = props;
    const selectedIndex = options.findIndex(item => item.get(customValue) === selected.get(customValue));
    clearTimeout(this.moveTimer);
    this.moveTimer = setTimeout(() => {
      const state = this.computWidth();
      this.setState(state);
      this.moveTo(selectedIndex)
    }, 20);
  }
  // 计算宽度 
  // { itemsWidth: array 每一项的宽度, innerWidth：number 每项的宽度之合 滚动宽度, wrapWidth： number 容器宽度, showArrowBtn: Boolean 是否展示移动箭头 }
  computWidth = () => {
    const innerElement = this.innerElement;
    const aItems = Array.from(innerElement.children);
    const itemsWidth = aItems.map(el => parseFloat(el.offsetWidth));
    const innerWidth = parseFloat(innerElement.offsetWidth);
    const wrapWidth = parseFloat(innerElement.parentNode.offsetWidth);
    const showArrowBtn = wrapWidth < innerWidth;
    return { itemsWidth, innerWidth, wrapWidth, showArrowBtn };
  }
  // 移动到指定的内容 index 该内容的索引
  moveTo = index => {
    const { itemsWidth, innerWidth, wrapWidth } = this.state; //this.computWidth(this.props);
    if (wrapWidth >= innerWidth) {
      this.setState({ offsetX: 0, leftIndex: 0 });
      return
    }
    const maxScrollLeft = wrapWidth - innerWidth - 5;
    let offsetX = 0, leftIndex = index;
    for (let i = 0; i < itemsWidth.length - 1; i++) {
      if (offsetX <= maxScrollLeft || i >= index) {
        leftIndex = i;
        break;
      }
      offsetX -= itemsWidth[i];
      if (offsetX < maxScrollLeft) {
        offsetX = maxScrollLeft;
      }
    }
    this.setState({ offsetX, leftIndex });
  }
  // 点击右侧按钮， 向右移动内容 e 点击事件
  rightHandle = e => {
    e.stopPropagation();
    const { offsetX, itemsWidth, innerWidth, wrapWidth, leftIndex } = this.state;
    if (wrapWidth >= innerWidth + offsetX && offsetX <= 0) return; // 已在最右侧
    if (leftIndex >= itemsWidth.length) return;
    this.moveTo(leftIndex + 1);
  }
  // 点击左侧箭头， 向左移动内容 e 点击事件
  leftHandle = e => {
    e.stopPropagation();
    const { offsetX, leftIndex } = this.state;
    if (offsetX >= 0) return;
    if (leftIndex <= 0) return;
    this.moveTo(leftIndex - 1)
  }
  render () {
    const { prefixCls, customLabel, customValue, options, selected } = this.props;
    const { offsetX, showArrowBtn } = this.state;
    return (
      <div className={`${prefixCls}-line-scroll-selector`}>
        <div className={`${prefixCls}-line-handle prev-handle`} onClick={this.leftHandle} style={{ visibility: showArrowBtn ? 'visible' : 'hidden' }}></div>
        <div className={`${prefixCls}-line-scroll-container`}>
          <div className={`${prefixCls}-line-scroll-inner`} ref={el => this.innerElement = el} style={{ left: offsetX + 'px' }}>
            {
              options.map(it => {
                const temp = fromJS(parseOption(it, customLabel, customValue));
                let selectIt = selected.get(customValue) === temp.get(customValue);
                return (
                  <span className={`${selectIt ? 'selected' : ''}`} onClick={() => this.selectHandle(temp)} key={temp.get(customValue)}>
                    {temp.get(customLabel)}
                  </span>
                )
              })
            }
          </div>
        </div>
        <div className={`${prefixCls}-line-handle next-handle`} onClick={this.rightHandle} style={{ visibility: showArrowBtn ? 'visible' : 'hidden' }}></div>
      </div>
    )
  }
}
LineScrollSelector.defaultProps = {
  onSelect: function(option) {
    
    console.warn(`component LineScrollSelector fired default props func: onSelect(${toString(option)})`)
  },
  prefixCls: 'zm-select',
  options: fromJS([]),
}
LineScrollSelector.propTypes = {
  onSelect: PropTypes.func,
  prefixCls: PropTypes.string,
  selected: PropTypes.instanceOf(Immutable.Map),
  customValue: PropTypes.string,
  customLabel: PropTypes.string,
  options: PropTypes.instanceOf(Immutable.List),
}

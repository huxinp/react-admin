import React from 'react';
import PropTypes from 'prop-types';
import Trigger from 'rc-trigger';
import classnames from 'classnames';
import Immutable, { fromJS } from 'immutable';
import ColSelector from './ColSelector';
import RowSelector from './RowSelector';
import createTrigger from './createTrigger';

// import Trigger from '../../react-components/Trigger';

import { getSelectPath, placements, toString } from './utils';

import './index.scss';

export default class ZmSelect extends React.PureComponent {
  state = {
    popup: false,
    colSelected: fromJS({}),
    rowSelected: fromJS({}),
    colSort: [], // rol option key array
    rowSort: [], // row option key array
  }
  componentWillReceiveProps(nextProps) {
    if ('selected' in nextProps) {
      if (nextProps.selected !== this.props.selected) {
        this.init(nextProps);
      }
    }
    if ('defaultSelected' in nextProps) {
      if (nextProps.defaultSelected !== this.props.defaultSelected) {
        this.init(nextProps);
      }
    }
  }
  componentDidMount() {
    this.init(this.props);
    // document.addEventListener('click', this.clickOutside)
  }
  componentWillUnmount() {
    // document.removeEventListener('click', this.clickOutside);
    this.container = null;
  }
  init = props => {
    const { selected, defaultSelected, rowOptions, colOptions, customValue } = props;
    const colSort = [], rowSort = [];
    let colSelected = fromJS({}), rowSelected = fromJS({});
    rowOptions.forEach(item => rowSort.push(item.get(customValue)));
    colOptions.forEach(item => colSort.push(item.get(customValue)));
    if (selected || defaultSelected) { // 有选中 | 默认选中
      const selectedObj = Object.assign({}, (defaultSelected || fromJS({})).toJS(), (selected || fromJS({})).toJS());
      rowSort.forEach(key => {
        if (selectedObj[key] !== undefined) {
          rowSelected = rowSelected.set(key, fromJS(selectedObj[key]));
        }
      })
      colSort.forEach(key => {
        if (selectedObj[key] !== undefined) {
          colSelected = colSelected.set(key, fromJS(selectedObj[key]));
        }
      })
    }
    this.setState({ colSort, rowSort, colSelected, rowSelected });
  }
  selectHandle = (key, selected, type) => {
    const { onSelect } = this.props;
    const { colSelected, rowSelected } = this.state;
    let result;
    if (type === 'rowSelect') {
      result = colSelected.merge(selected);
    } else {
      result = rowSelected.merge(selected);
    }
    this.setState({ [`${type}ed`]: selected });
    onSelect(key, result, type, (state = false) => this.popupHandle(state));
  }
  popupHandle = state => {
    this.setState({
      popup: state,
    })
  }
  getRef = el => {
    this.container = el;
    this.props.innerRef(el);
  }
  clickOutside = e => {
    if (!this.container) return
    if (!(this.container.contains(e.target))) {
      this.popupHandle(false)
    }
  }
  getPopupContainer = () => {

  }
  render() {
    const { prefixCls, rowOptions, colOptions, customValue, customLabel, placeHolder, className, children } = this.props;
    const { popup, rowSelected, colSelected, colSort, rowSort } = this.state;
    const selectPath = getSelectPath(rowSelected.merge(colSelected), [...rowSort, ...colSort], customLabel);
    const extendProps = { prefixCls, customLabel, customValue };
    const makePopupClassname = classnames(`${prefixCls}-popup`, {
      [`${className}-popup`]: className
    })
    const selector = (
      <div className={makePopupClassname}>
        { !!rowOptions.count() && (
            <RowSelector
              options={rowOptions}
              selected={rowSelected}
              onSelect={this.selectHandle}
              onlySelector={colOptions.count() === 0}
              placeHolder={placeHolder}
              selectPath={selectPath}
              {...extendProps}
            />
          )
        }
        { !!colOptions.count() && (
            <ColSelector
              options={colOptions}
              selected={colSelected}
              onSelect={this.selectHandle}
              onlySelector={rowOptions.count() === 0}
              {...extendProps}
            />
          )
        }
      </div>
    )
    const child = typeof children === 'function' ?
        React.createElement(children, { selectPath, onClick: this.popupHandle, popup }) :
        React.cloneElement(children, { selectPath, onClick: this.popupHandle, popup });
    return createTrigger(child, selector, {
      builtinPlacements: placements,
      popupPlacement: 'bottomLeft',
      action: ['click'],
      popupAnimation: 'slide-up',
      destroyPopupOnHide: true,
      onPopupVisibleChange: this.popupHandle,
    });
    return (
      <Trigger
        popup={selector}
        popupStyle={{position: 'absolute'}}
        // popupClassName="zm-select-popup-container"
        builtinPlacements={placements}
        popupPlacement={'topLeft'}
        action={['click']}
        destroyPopupOnHide={true}
        onPopupVisibleChange={this.popupHandle}
        // getPopupContainer={}
      >
        {child}
      </Trigger>
    )
  }
}
ZmSelect.defaultProps = {
  prefixCls: 'zm-select',
  customLabel: 'name',
  customValue: 'id',
  rowOptions: fromJS([]),
  colOptions: fromJS([]),
  onSelect: function(key, result, type, close) {
    console.warn(`component ZmSelect fired default props func: onSelect(${key}, ${toString(result)}, ${type}, ${toString(close)})`)
  },
  innerRef: () => {},
  className: '',
  placeHolder: '请选择...',
  // children: '',
}
ZmSelect.propTypes = {
  prefixCls: PropTypes.string,
  selected: PropTypes.instanceOf(Immutable.Map),
  defaultSelected: PropTypes.instanceOf(Immutable.Map),
  customLabel: PropTypes.string,
  customValue: PropTypes.string,
  rowOptions: PropTypes.instanceOf(Immutable.List),
  colOptions: PropTypes.instanceOf(Immutable.List),
  onSelect: PropTypes.func,
  placeHolder: PropTypes.string,
  innerRef: PropTypes.func,
  className: PropTypes.string,
  // children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
}
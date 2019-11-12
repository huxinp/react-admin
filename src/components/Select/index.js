import React, { PropTypes } from 'react';
import Trigger from 'rc-trigger';
import Immutable, { fromJS } from 'immutable';
import SelectPanel from './SelectPanel';
import SelectInput from './SelectInput';

import { getSelectPath, placements, toString } from './utils';

import './index.scss';

export default class Select extends React.PureComponent {
  state = {
    open: false,
    selectPath: {},
  }
  componentDidMount() {
    const { selected, defaultSelected, rowOptions, colOptions, customValue, customLabel } = this.props;
    if (selected || defaultSelected) { // 有选中 | 默认选中
      const selectedObj = Object.assign({}, (defaultSelected || fromJS({})).toJS(), (selected || fromJS({})).toJS());
      const sortArray = [];
      rowOptions.concat(colOptions).forEach(item => sortArray.push(item.get(customValue)));
      const selectPath = getSelectPath(fromJS(selectedObj), sortArray, customLabel);
      this.setState({ selectPath });
    }
  }
  // 选择
  selectHandle = (key, selected, type) => {
    const { rowOptions, colOptions, customValue, customLabel } = this.props;
    const sortArray = [];
    rowOptions.concat(colOptions).forEach(item => sortArray.push(item.get(customValue)));
    const selectPath = getSelectPath(selected, sortArray, customLabel);
    this.setState({ selectPath });
    this.props.onSelect(key, selected, type, (state = false) => this.popupHandle(state));
  }
  // 弹出或者隐藏
  popupHandle = state => {
    this.setState({
      open: state,
    });
  }
  render() {
    const { prefixCls, placeHolder, popupClassName, children, ...otherProps } = this.props;
    const { open, selectPath } = this.state;
    const selector = (
      <SelectPanel
        {...otherProps}
        prefixCls={prefixCls}
        className={popupClassName}
        onSelect={this.selectHandle}
      />
    )
    const child = typeof children === 'function' ?
        React.createElement(children, { selectPath, onClick: () => this.popupHandle(true), open, prefixCls, placeHolder }) :
        React.cloneElement(children, { selectPath, onClick: () => this.popupHandle(true), open, prefixCls, placeHolder });
    return (
      <Trigger
        popup={selector}
        popupVisible={open}
        popupStyle={{position: 'absolute'}}
        builtinPlacements={placements}
        popupPlacement={'topLeft'}
        action={['click']}
        destroyPopupOnHide={true}
        onPopupVisibleChange={this.popupHandle}
      >
        {child}
      </Trigger>
    )
  }
}
Select.defaultProps = {
  prefixCls: 'select',
  customLabel: 'name',
  customValue: 'id',
  rowOptions: fromJS([]),
  colOptions: fromJS([]),
  onSelect: function(key, result, type, close) {
    console.warn(`component Select fired default props func: onSelect(${key}, ${toString(result)}, ${type}, ${toString(close)})`)
  },
  popupRef: () => {},
  popupClassName: '',
  children: SelectInput,
  placeHolder: '请选择...',
}
Select.propTypes = {
  prefixCls: PropTypes.string,
  selected: PropTypes.instanceOf(Immutable.Map),
  defaultSelected: PropTypes.instanceOf(Immutable.Map),
  customLabel: PropTypes.string,
  customValue: PropTypes.string,
  rowOptions: PropTypes.instanceOf(Immutable.List),
  colOptions: PropTypes.instanceOf(Immutable.List),
  onSelect: PropTypes.func,
  placeHolder: PropTypes.string,
  popupRef: PropTypes.func,
  popupClassName: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
}
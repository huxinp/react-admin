import React, { PropTypes } from 'react';
import Immutable, { fromJS } from 'immutable';
import ColSelector from './ColSelector';
import RowSelector from './RowSelector';

import { getSelectPath, toString } from './utils';

import './index.scss';

export default class SelectPanel extends React.PureComponent {
  state = {
    colSelected: fromJS({}),
    rowSelected: fromJS({}),
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
  }
  // 初始化处理
  init = props => {
    const { selected, defaultSelected, rowOptions, colOptions, customValue } = props;
    let colSelected = fromJS({}), rowSelected = fromJS({});
    if (selected || defaultSelected) { // 有选中 | 默认选中
      const selectedObj = Object.assign({}, (defaultSelected || fromJS({})).toJS(), (selected || fromJS({})).toJS());
      rowOptions.forEach(item => {
        const key = item.get(customValue);
        if (selectedObj[key] !== undefined) {
          rowSelected = rowSelected.set(key, fromJS(selectedObj[key]));
        }
      })
      colOptions.forEach(item => {
        const key = item.get(customValue);
        if (selectedObj[key] !== undefined) {
          colSelected = colSelected.set(key, fromJS(selectedObj[key]));
        }
      })
    }
    this.setState({ colSelected, rowSelected });
  }
  // 选择处理
  selectHandle = (key, selected, type) => {
    const { onSelect } = this.props;
    const { colSelected, rowSelected } = this.state;
    let result;
    if (type === 'rowSelect') {
      result = colSelected.merge(selected);
    } else {
      result = rowSelected.merge(selected);
    }
    this.setState({ [`${type}ed`]: selected }); // `${type}ed` one of ['colSelected', 'rowSelected']
    onSelect(key, result, type);
  }
  // 获取ref
  getRef = el => {
    this.props.popupRef(el);
  }
  render() {
    const { prefixCls, rowOptions, colOptions, customValue, customLabel, placeHolder, className } = this.props;
    const { rowSelected, colSelected } = this.state;
    const extendProps = { prefixCls, customLabel, customValue };
    const sortArray = [];
    rowOptions.forEach(item => sortArray.push(item.get(customValue)));
    const selectPath = getSelectPath(rowSelected, sortArray, customLabel);
    const makePopupClassname = `${prefixCls}-panel ${className}-panel`;
    return (
      <div className={makePopupClassname} ref={this.getRef}>
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
  }
}
SelectPanel.defaultProps = {
  prefixCls: 'select',
  customLabel: 'name',
  customValue: 'id',
  rowOptions: fromJS([]),
  colOptions: fromJS([]),
  onSelect: function(key, result, type, close) {
    console.warn(`component SelectPanel fired default props func: onSelect(${key}, ${toString(result)}, ${type}, ${toString(close)})`)
  },
  popupRef: () => {},
  className: '',
  placeHolder: '请选择...',
}
SelectPanel.propTypes = {
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
  className: PropTypes.string,
}
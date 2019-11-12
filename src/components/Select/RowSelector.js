import React, { PropTypes } from 'react';
import Immutable, { fromJS } from 'immutable';
import LineScrollSelector from './LineScrollSelector';
import { toString } from './utils';
import './index.scss';

export default class RowSelector extends React.PureComponent {
  state = {
    collapse: !this.props.onlySelector,
  }
  // select 处理
  selectHandle = (key, option) => {
    const { selected, onSelect } = this.props;
    onSelect(key, selected.set(key, option), 'rowSelect');
  }
  // 未折叠的面板
  makeUnCollapsePanel = () => {
    const { prefixCls, selected, options, customLabel, customValue } = this.props;
    return (
      <div className={`${prefixCls}-row-uncollapse`}>
        <div className={`${prefixCls}-row-labels`}>
          { options.map(item => (<div key={item.get(customValue)}>{item.get(customLabel)}:</div>)) }
        </div>
        <div className={`${prefixCls}-row-options`}>
          {
            options.map(item => {
              const list = item.get('options') || fromJS([]);
              const key = item.get(customValue);
              return (
                <LineScrollSelector
                  key={key}
                  options={list}
                  selected={selected.get(key) || fromJS({})}
                  onSelect={option => this.selectHandle(key, option)}
                  customLabel={customLabel}
                  customValue={customValue}
                />
              )
            })
          }
        </div>
      </div>
    )
  }

  render() {
    const { prefixCls, onlySelector, placeHolder, selectPath } = this.props;
    const { collapse } = this.state;
    return (
      <div className={`${prefixCls}-row-selector ${collapse ? 'collapsed' : ''} ${onlySelector ? 'only-row' : ''}`}>
        {
          collapse ? ( // 已折叠的面板
            <div className={`${prefixCls}-row-collapse ellipsis`}>
              <span>您当前已经选择了:</span>
              <span title={selectPath.titlePath || placeHolder}>{ selectPath.titlePath || placeHolder }</span>
            </div>
          ) : this.makeUnCollapsePanel()
        }
        {
          !onlySelector && (
            <div className={`${prefixCls}-collapse-btn arrow ${ collapse ? '' : 'fire'}`} onClick={() => this.setState({ collapse: !collapse })}>
              {collapse ? '展开编辑' : '收起编辑'}
            </div>
          )
        }
      </div>
    )
  }
}
RowSelector.defaultProps = {
  options: fromJS([]),
  selected: fromJS({}),
  onSelect: function(key, selected, type) {
    console.warn(`component RowSelector fired default props func: onSelect(${key}, ${toString(selected)}, ${type})`)
  },
  placeHolder: '请选择...',
  selectPath: {},
}
RowSelector.propTypes = {
  prefixCls: PropTypes.string,
  selected: PropTypes.instanceOf(Immutable.Map),
  options: PropTypes.instanceOf(Immutable.List),
  customLabel: PropTypes.string,
  customValue: PropTypes.string,
  onSelect: PropTypes.func,
  onlySelector: PropTypes.bool,
  placeHolder: PropTypes.string,
  selectPath: PropTypes.object,
}
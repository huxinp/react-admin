import React from 'react';
import PropTypes from 'prop-types';
import Immutable, { fromJS } from 'immutable';
import { parseOption, toString } from './utils';
import './index.scss';

export default class ColSelector extends React.PureComponent {
  state = {
    
  }

  selectHandle = (key, option) => {
    const { selected, onSelect } = this.props;
    onSelect(key, selected.set(key, option), 'colSelect');
  }

  render() {
    const { prefixCls, options, selected, customLabel, customValue, onlySelector } = this.props;
    return (
      <div className={`${prefixCls}-col-selector ${onlySelector ? 'only-col' : ''}`}>
        {
          options.map(item => {
            const list = item.get('options') || fromJS([]);
            const key = item.get(customValue);
            return (
              <div className={`${prefixCls}-col-options ${prefixCls}-col-options-${key}`} key={key}>
                {
                  list.map(it => {
                    const temp = fromJS(parseOption(it, customLabel, customValue));
                    const select = selected.get(key) || fromJS({});
                    let selectIt = select.get(customValue) === temp.get(customValue);
                    return (
                      <div className={`${selectIt ? 'selected' : ''}`} key={temp.get(customValue)} onClick={() => this.selectHandle(key, temp)}>
                        {temp.get(customLabel)}
                      </div>
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    )
  }
}
ColSelector.defaultProps = {
  options: fromJS([]),
  selected: fromJS({}),
  onSelect: function (key, selected, type) {
    console.warn(`component ColSelector fired default props func: onSelect(${key}, ${toString(selected)}, ${type})`)
  },
}
ColSelector.propTypes = {
  prefixCls: PropTypes.string,
  options: PropTypes.instanceOf(Immutable.List),
  selected: PropTypes.instanceOf(Immutable.Map),
  onSelect: PropTypes.func,
  customLabel: PropTypes.string,
  customValue: PropTypes.string,
  onlySelector: PropTypes.bool,
  sort: PropTypes.array,
}
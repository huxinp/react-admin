import React, { PropTypes } from 'react';

import Trigger from 'rc-trigger';

import Menu from './Menu';

import './index.less';

const  DEFAULT_PROPS = {
  value: 'value',
  label: 'label',
  children: 'children',
}

const autoAdjustOverflow = {
  adjustX: true,
  adjustY: true
};

const placements = {
  bottomLeft: {
    points: ['tl', 'bl'],
    overflow: autoAdjustOverflow,
    offset: [0, 5],
  },
  bottomRight: {
    points: ['tr', 'tr'],
    overflow: autoAdjustOverflow,
    offset: [0, -5],
  },
  topRight: {
    points: ['br', 'br'],
    overflow: autoAdjustOverflow,
    offset: [0, 5],
  },
  topLeft: {
    points: ['bl', 'tl'],
    overflow: autoAdjustOverflow,
    offset: [0, -5],
  }
};

export default class Dropdown extends React.PureComponent {
  state = {
    drop: false,
    width: 150,
    activeOptions: [],
    selectedOptions: [],
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.value !== this.props.value ||
      nextProps.cascader !== this.props.cascader ||
      nextProps.options !== this.props.options
    ) {
      this.initValue(nextProps);
    }
  }
  componentDidMount() {
    this.initValue(this.props, (selectedOptions) => {
      const { onChange, autoSelect } = this.props;
      if (autoSelect) onChange(selectedOptions);
    });
    this.setState({ width: this.inputEl.offsetWidth });
  }
  initValue = (theProps = this.props, next) => {
    const { cascader, value, options, props } = theProps;
    const values = value.slice(0, cascader);
    const selectedOptions = [];
    let list = options;
    const optionProps = Object.assign({}, DEFAULT_PROPS, props);
    const key = optionProps.value;
    const children = optionProps.children;
    values.map((v, i) => {
      const item = list.filter(ite => ite[key] === v[key])[0]
      if (item && item[children]) {
        list = item[children];
      }
      item && selectedOptions.push(item);
    });
    this.setState({ selectedOptions, activeOptions: selectedOptions }, next && next(selectedOptions));
  }
  selectHandle = (index, item) => {
    const { cascader, onChange, onSelect } = this.props;
    if (!item.children) delete item.children;
    const activeOptions = [...this.state.activeOptions.slice(0, index), item];
    if (index + 1 >= cascader || !item.children) {
      this.setState({
        selectedOptions: activeOptions,
      })
      this.popupHandle();
      onChange(activeOptions);
      onSelect(activeOptions);
    } else {
      this.setState({ activeOptions })
      onSelect(activeOptions);
    }
  }
  popupHandle = () => {
    const { drop, selectedOptions, activeOptions } = this.state;
    this.setState({
      activeOptions: drop ? selectedOptions : activeOptions,
      drop: !drop,
    })
  }
  render() {
    const { placeholder, popupZIndex, options, props, cascader } = this.props;
    const { drop, activeOptions, selectedOptions, width } = this.state;
    const label = Object.assign({}, DEFAULT_PROPS, props).label;
    const actived = [], holdOptions = drop ? activeOptions : selectedOptions;
    holdOptions.forEach(item => {
      actived.push(item[label]);
    });
    const dropdownMenu = (
      <Menu
        activeOptions={holdOptions}
        options={options}
        onChange={this.selectHandle}
        cascader={cascader}
        props={props}
        width={width}
      />
    )
    return (
      <Trigger
        popup={dropdownMenu}
        popupVisible={drop}
        popupStyle={{position: 'absolute'}}
        builtinPlacements={placements}
        popupPlacement={'bottomLeft'}
        action={['click']}
        destroyPopupOnHide={true}
        onPopupVisibleChange={this.popupHandle}
        zIndex={popupZIndex}
      >
        <div className={`dropdown-input ${drop ? 'droped' : ''}`} ref={el => this.inputEl = el}>
          <input type="text" placeholder={placeholder} value={actived.join(' / ')} readOnly />
        </div>
      </Trigger>
    )
  }
}
Dropdown.defaultProps = {
  placeholder: '请选择...',
  value: [],
  popupZIndex: 1,
  options: [],
  onChange: function (activeOptions) {
    console.warn(`component Dropdown fired default props func: onChange(${activeOptions})`);
  },
  onSelect: function () {},
  cascader: 1,
  autoSelect: false,
  props: {},
}
Dropdown.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.array,
  popupZIndex: PropTypes.number,
  options: PropTypes.array,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  cascader: PropTypes.number,
  autoSelect: PropTypes.bool,
  props: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
    children: PropTypes.string,
  }),
}

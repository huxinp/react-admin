import React, { PropTypes } from 'react';
import Animate from 'rc-animate';

const  DEFAULT_PROPS = {
  value: 'value',
  label: 'label',
  children: 'children',
}

export default class Menu extends React.PureComponent {
  state = {

  }

  render() {
    const { options, props, activeOptions, cascader, width } = this.props;
    const { value, label, children } = Object.assign({}, DEFAULT_PROPS, props);
    return (
      <Animate
        className="dropdown-menu"
      >
        <Animate
          key="options"
          className={`dropdown-cascader-menu ${cascader === 1 ? 'only-menu' : ''}`}
          style={{width: cascader === 1 ? width : 'auto'}}
        >
          {
            options.map(item => {
              const active = activeOptions[0] && activeOptions[0][value] === item[value];
              return (
                <div className={`dropdown-menu-item ${active ? 'actived' : ''}`} key={item[value]} onClick={() => this.props.onChange(0, item)}>
                  <span>{item[label]}</span>
                  { item[children] && cascader > 1 ? <span className="has-child-icon"></span> : null }
                </div>
              )
            })
          }
        </Animate>
        {
          cascader > 1 && activeOptions.map((options, index) => {
            if (index + 1 >= cascader) return null;
            return (
              <Animate
                className="dropdown-cascader-menu"
                key={`${options[label]}-${index}`}
              >
                {
                  options[children] && options[children].map(item => {
                    const active = activeOptions[index + 1] && activeOptions[index + 1][value] === item[value];
                    return (
                      <div className={`dropdown-menu-item ${active ? 'actived' : ''}`} key={item[value]} onClick={() => this.props.onChange(index + 1, item)}>
                        <span>{item[label]}</span>
                        { item[children] && index + 1 < cascader - 1 ? <span className="has-child-icon"></span> : null }
                      </div>
                    )
                  })
                }
              </Animate>
            )
          })
        }
      </Animate>
    )
  }
}

Menu.defalutProps = {
  activeOptions: [],
  cascader: 1,
}
Menu.propTypes = {
  activeOptions: PropTypes.array,
  onChange: PropTypes.func,
  props: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
    children: PropTypes.string,
  }),
  cascader: PropTypes.number,
  width: PropTypes.number,
}
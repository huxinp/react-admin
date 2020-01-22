import React from 'react';
import PropTypes from 'prop-types';
import LazyRenderBox from './LazyRenderBox';

export default class PopupInner extends React.Component {
  render() {
    const {
      visible, hiddenClassName, onMouseEnter, onMouseLeave,
      onMouseDown, onTouchStart, style, prefixCls,
    } = this.props;
    let className = this.props.className;
    if (!visible) {
      className += ' ' + hiddenClassName;
    }
    return React.createElement(
      'div',
      {
        className,
        onMouseEnter,
        onMouseLeave,
        onMouseDown,
        onTouchStart,
        style,
      },
      React.createElement(
        LazyRenderBox,
        {
          className: prefixCls + '-content',
          visible,
        },
        this.props.children,
      )
    )
  }
}

PopupInner.propTypes = {
  hiddenClassName: PropTypes.string,
  className: PropTypes.string,
  prefixCls: PropTypes.string,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onTouchStart: PropTypes.func,
  onMouseDown: PropTypes.func,
  children: PropTypes.any,
}

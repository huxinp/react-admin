import React from 'react';
import LazyRenderBox from './LazyRenderBox';

class PopupInner extends React.Component {
  render() {
    let { className, visible, hiddenClassName, onMouseDown, onMouseEnter, onMouseLeave, onTouchStart, style, prefixCls, children } = this.props;
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
        children,
      )
    )
  }
}

export default PopupInner;
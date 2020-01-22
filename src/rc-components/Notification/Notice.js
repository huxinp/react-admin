import React, { PropTypes } from 'react';

import classnames from 'classnames';

export default class Notice extends React.Component {
  constructor(props) {
    super(props);
    this.startCloseTimer = this.startCloseTimer.bind(this);
    this.clearCloseTimer = this.clearCloseTimer.bind(this);
    this.close = this.close.bind(this);
    this.closeTimer = null;
  }

  componentDidMount() {
    this.startCloseTimer();
  }

  componentWillUnmount() {
    this.clearCloseTimer();
  }

  close() {
    this.clearCloseTimer();
    this.props.onClose();
  }

  startCloseTimer() {
    if (this.props.duration) {
      this.closeTimer = setTimeout(() => {
        this.close();
      }, this.props.duration * 1000);
    }
  }

  clearCloseTimer() {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  render() {
    const { className, style, prefixCls, children, closable } = this.props;
    const componentClass = prefixCls + '-notice';
    const _className = classnames(componentClass, className, {
      [componentClass + '-closable']: closable,
    })
    return React.createElement(
      'div',
      {
        className: _className,
        style,
        onMouseEnter: this.clearCloseTimer,
        onMouseLeave: this.startCloseTimer
      },
      React.createElement(
        'div',
        { className: componentClass + '-content' },
        children
      ),
      closable ? React.createElement(
        'a',
        { tabIndex: '0', onClick: this.close, className: componentClass + '-close' },
        React.createElement('span', { className: componentClass + '-close-x' })
      ) : null
    )
  }
}

Notice.defaultProps = {
  onEnd: function onEnd() {},
  onClose: function onClose() {},

  duration: 1.5,
  style: {
    right: '50%',
  }
}

Notice.propTypes = {
  duration: PropTypes.number,
  onClose: PropTypes.func,
  children: PropTypes.any,
}
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import addDOMEventListener from 'add-dom-event-listener';
import domAlign from 'dom-align';

function buffer (fn, ms) {
  let timer;
  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }
  function bufferFn () {
    clear();
    timer = setTimeout(fn, ms);
  }
  bufferFn.clear = clear;
  return bufferFn;
}

function getElement(func) {
  if (typeof func !== 'function' || !func) return null;
  return func()
}

function getPoint(point) {
  if (typeof point !== 'object' || !point) return null;
  return point;
}

function isWindow(obj) {
  return obj && typeof obj === 'object' && obj.widnow === obj;
}

function isSamePoint(prev, next) {
  if (!prev || !next) return false;
  if (prev === next) return true;
  if ('pageX' in next && 'pageY' in next) {
    return prev.pageX === next.pageX && prev.pageY === next.pageY;
  }
  if ('clientX' in next && 'clientY' in next) {
    return prev.clientX === next.clientX && prev.clientY === next.clientY;
  }
  return false;
}

function isSimilarValue(val1, val2) {
  var int1 = Math.floor(val1);
  var int2 = Math.floor(val2);
  return Math.abs(int1 - int2) <= 1;
}

function contains(root, n) {
  let node = n;
  while(node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

function restoreFocus(activeElement, container) {
  if (activeElement !== document.activeElement && contains(container, activeElement)) {
    activeElement.focus();
  }
}
function addEventListenerWrap(target, eventType, cb, option) {
  /* eslint camelcase: 2 */
  var callback = ReactDOM.unstable_batchedUpdates ? function run(e) {
    ReactDOM.unstable_batchedUpdates(cb, e);
  } : cb;
  return addDOMEventListener(target, eventType, callback, option);
}
class Align extends React.Component {
  componentDidMount() {
    const { disabled, monitorWindowResize } = this.props;
    this.forceAlign();
    if (!disabled && monitorWindowResize) {
      this.startMonitorWindowResize();
    }
  }
  componentDidUpdate(prevProps) {
    let reAlign = false;
    const { disabled, target, monitorWindowResize } = this.props;
    if (!disabled) {
      const source = ReactDOM.findDOMNode(this);
      const sourceRect = source ? source.getBoundingClientRect() : null;
      if (prevProps.disabled) {
        reAlign = true;
      } else {
        const lastElement = getElement(prevProps.target);
        const currentElement = getElement(target);
        const lastPoint = getPoint(prevProps.target);
        const currentPoint = getPoint(target);
        if (isWindow(lastElement) && isWindow(currentElement)) {
          reAlign = false;
        }
        else if (
          lastElement !== currentElement ||                       // Element change
          lastElement && !currentElement && currentPoint ||       // Change from element to point
          lastPoint && currentPoint && currentElement ||          // Change from point to element
          currentPoint && !isSamePoint(lastPoint, currentPoint)   //
        ) {
          reAlign = true;
        }
        const preRect = this.sourceRect || {};
        if (!reAlign && source && (!isSimilarValue(preRect.width, sourceRect.width) || !isSimilarValue(preRect.height, sourceRect.height)) {
          reAlign = true;
        }
      }
      this.sourceRect = sourceRect;
    }
    if (reAlign) {
      this.forceAlign()
    }
    if (monitorWindowResize && !disabled) {
      this.startMonitorWindowResize();
    } else {
      this.stopMonitorWindowResize();
    }
  }
  componentWillUnmount() {
    this.stopMonitorWindowResize();
  }
  startMonitorWindowResize = () => {
    if (!this.resizeHandler) {
      this.bufferMonitor = buffer(this.forceAlign, this.props.monitorBufferTime);
      this.resizeHandler = addEventListenerWrap(window, 'resize', this.bufferMonitor);
    }
  }
  stopMonitorWindowResize = () => {
    if (this.resizeHandler) {
      this.bufferMonitor.clear();
      this.resizeHandler.remove();
      this.resizeHandler = null;
    }
  }
  forceAlign = () => {
    const { disabled, target, align, onAlign } = this.props;
    if (!disabled && target) {
      const source = ReactDOM.findDOMNode(this);
      let result;
      const element = getElement(target);
      const point = getPoint(target);
      const activeElement = window.activeElement;
      if (element) {
        result = domAlign.alignElement(source, element, align);
      } else if (point) {
        result = domAlign.alignPoint(source, point, align);
      }
      restoreFocus(activeElement, source);
      if (onAlign) {
        onAlign(source, result);
      }
    }
  }
  render() {
    const { children, childrenProps } = this.props;
    const child = React.Children.only(children);
    if (childrenProps) {
      const newProps = {};
      const propList = Object.keys(childrenProps);
      propList.forEach(prop => {
        newProps[prop] = this.props[childrenProps[prop]]
      });
      return React.cloneElement(child, newProps);
    }
    return child;
  }
}
Align.propTypes = {
  childrenProps: PropTypes.object,
  align: PropTypes.object.isRequired,
  target: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({
    clientX: PropTypes.number,
    clientY: PropTypes.number,
    pageX: PropTypes.number,
    pageY: PropTypes.number
  })]),
  onAlign: PropTypes.func,
  monitorBufferTime: PropTypes.number,
  monitorWindowResize: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.any
};
Align.defaultProps = {
  target: function target() {
    return window;
  },
  monitorBufferTime: 50,
  monitorWindowResize: false,
  disabled: false
};
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { alignElement, alignPoint } from 'dom-align';

import {
  isWindow, buffer, isSamePoint,
  isSimilarValue, restoreFocus
} from './util';

function getElement(func) {
  if (typeof func !== 'function' || !func) return null;
  return func();
}

function getPoint(point) {
  if (typeof point !== 'object' || !point) return null;
  return point;
}

export default class Align extends React.Component {
  constructor(props) {
    super(props);
    this.forceAlign = this.forceAlign.bind(this);
  }

  componentDidMount() {
    this.forceAlign();
    if (!this.props.disabled && this.props.monitorWindowResize) {
      this.startMonitorWindowResize();
    }
  }
  componentDidUpdate(prevProps) {
    let reAlign = false;
    const props = this.props;
    if (!props.disabled) {
      const source = ReactDOM.findDOMNode(this);
      const sourceRect = source ? source.getBoundingClientRect() : null;
      if (prevProps.disabled) {
        reAlign = true;
      } else {
        const lastElement = getElement(prevProps.target);
        const currentElement = getElement(props.target);
        const lastPoint = getPoint(prevProps.target);
        const currentPoint = getPoint(props.target);
        if (isWindow(lastElement) && isWindow(currentElement)) {
          reAlign = false;
        } else if (
          lastElement !== currentElement ||
          lastElement && !currentElement && currentPoint ||
          lastPoint && currentPoint && currentElement ||
          currentPoint && !isSamePoint(lastPoint, currentPoint)
        ) {
          reAlign = true;
        }
        const preRect = this.sourceRect || {};
        if (!reAlign && source && (!isSimilarValue(preRect.width, sourceRect.width) || !isSimilarValue(preRect.height, sourceRect.height))) {
          reAlign = true;
        }
      }
      this.sourceRect = sourceRect;
    }
    if (reAlign) {
      this.forceAlign();
    }
    if (props.monitorWindowResize && !props.disabled) {
      this.startMonitorWindowResize();
    } else {
      this.stopMonitorWindowResize();
    }
  }
  componentWillUnmount() {
    this.stopMonitorWindowResize();
  }
  forceAlign() {
    const { disabled, target, align, onAlign } = this.props;
    if (!disabled && target) {
      const source = ReactDOM.findDOMNode(this);
      let result = void 0;
      const element = getElement(target);
      const point = getPoint(target);
      const activeElement = document.activeElement;
      if (element) {
        result = alignElement(source, element, align);
      } else if (point) {
        result = alignPoint(source, point, align);
      }
      restoreFocus(activeElement, source);
      if (onAlign) {
        onAlign(source, result);
      }
    }
  }
  startMonitorWindowResize() {
    if (!this.resizeHandler) {
      this.bufferMonitor = buffer(this.forceAlign, this.props.monitorBufferTime);
      this.resizeHandler = window.addEventListener('resize', this.bufferMonitor);
    }
  }
  stopMonitorWindowResize() {
    if (this.resizeHandler) {
      this.bufferMonitor.clear();
      window.removeEventListener('resize', this.bufferMonitor);
      this.bufferMonitor = null;
    }
  }
  render() {
    const { childrenProps, children } = this.props;
    const child = React.Children.only(children);
    if (childrenProps) {
      const newProps = {};
      const propList = Object.keys(childrenProps);
      propList.forEach(function(prop) {
        newProps[prop] = this.props[childrenProps[prop]];
      })
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
    pageY: PropTypes.number,
  })]),
  onAlign: PropTypes.func,
  monitorBufferTime: PropTypes.number,
  monitorWindowResize: PropTypes.bool,
  disabled: PropTypes.bool,
  children: PropTypes.any,
}
Align.defaultProps = {
  target: function target () {
    return window;
  },
  monitorBufferTime: 50,
  monitorWindowResize: false,
  disabled: false,
}
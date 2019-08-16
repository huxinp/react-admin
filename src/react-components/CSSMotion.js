import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import raf from 'raf';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true,
    })
  } else {
    obj[key] = obj;
  }
  return obj
}
const canUseDom = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

function makePrefixMap(styleProp, eventName) {
  var prefixes = {};

  prefixes[styleProp.toLowerCase()] = eventName.toLowerCase();
  prefixes['Webkit' + styleProp] = 'webkit' + eventName;
  prefixes['Moz' + styleProp] = 'moz' + eventName;
  prefixes['ms' + styleProp] = 'MS' + eventName;
  prefixes['o' + styleProp] = 'o' + eventName.toLowerCase();

  return prefixes
}

function getVendorPrefixes(domSupport, win) {
  const prefixes = {
    animationend: makePrefixMap('Animation', 'AnimationEnd'),
    transitionend: makePrefixMap('Transition', 'TransitionEnd'),
  }
  if (domSupport) {
    if(!('AnimationEvent' in win)) {
      delete prefixes.animationend.animation;
    }
    if (!('TransitionEvent' in win)) {
      delete prefixes.transitionend.transition;
    }
  }
  return prefixes;
}

const vendorPrefixes = getVendorPrefixes(canUseDom, typeof window !== 'undefined' ? window : {})
let style = {};
if (canUseDom) {
  style = document.createElement('div').style;
}
const prefixedEventNames = {};
function getVendorPrefixedEventName(eventName) {
  if (prefixedEventNames[eventName]) {
    return prefixedEventNames[eventName]
  }
  const prefixMap = vendorPrefixes[eventName];
  if (prefixMap) {
    const stylePropList = Object.keys(prefixMap);
    const len = stylePropList.length;
    for (let i = 0; i < len; i += 1) {
      const styleProp = stylePropList[i];
      if (Object.prototype.hasOwnProperty.call(prefixMap, styleProp) && styleProp in style) {
        prefixedEventNames[eventName] = prefixMap[styleProp];
        return prefixedEventNames[eventName]
      }
    }
  }
  return '';
}
const animationEndName = getVendorPrefixedEventName('animationend');
const transitionEndName = getVendorPrefixedEventName('transitionend');
export const supportTransition = !!(animationEndName && transitionEndName);
function getTransitionName(transitionName, transitionType) {
  if (!transitionName) return null;
  if (typeof transitionName === 'object') {
    const type = transitionType.replace(/-\w/g, match => {
      return match[1].toLowerCase();
    });
    return transitionName[type];
  }
  return transitionName + '-' + transitionType;
}


const STATUS_NONE = 'none';
const STATUS_APPEAR = 'appear';
const STATUS_ENTER = 'enter';
const STATUS_LEAVE = 'leave';

function findDOMNode(node) {
  if (node instanceof HTMLElement) {
    return node;
  }
  return ReactDOM.findDOMNode(node);
}

function getCSSMotion(config) {
  let transitionSupport = config;
  let forwardRef = !!React.forwardRef;
  if (typeof config === 'object') {
    transitionSupport = config.transitionSupport;
    forwardRef = 'forwardRef' in config ? config.forwardRef : forwardRef;
  }
  function isSupportTransition(props) {
    return !!(props.motionName && transitionSupport);
  }
  
  class CSSMotion extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        status: STATUS_NONE,
        statusActive: false,
        newStatus: false,
        statusStyle: null,
      }
      this.$cacheEle = null;
      this.node = null;
      this.raf = null;
    }
    componentDidMount() {
      this.onDomUpdate();
    }
    componentDidUpdate() {
      this.onDomUpdate();
    }
    componentWillUnmount() {
      this._destroyed = true;
      this.removeEventListener(this.$cacheEle);
      this.cancelNextFrame();
    }
    getDerivedStateFromProps(nextProps, prevState){
      const prevProps = prevState.prevProps;
      if (!isSupportTransition(nextProps)) return {}
      const { visible, motionAppear, motionEnter, motionLeave, motionLeaveImmediately } = nextProps;
      const newState = {
        prevProps: nextProps,
      }
      // Appear
      if (!prevProps && visible && motionAppear) {
        newState.status = STATUS_APPEAR;
        newState.statusActive = false;
        newState.newStatus = true;
      }
      // Enter
      if (prevProps && !prevProps.visible && visible && motionEnter) {
        newState.status = STATUS_ENTER;
        newState.statusActive = false;
        newState.newStatus = true;
      }
      // Leave
      if (
        prevProps && prevProps.visible && !visible && motionLeave ||
        !prevProps && motionLeaveImmediately && !visible && motionLeave
      ) {
        newState.status = STATUS_LEAVE;
        newState.statusActive = false;
        newState.newStatus = true;
      }
      return newState
    }
    onDomUpdate = () => {
      const { status, newStatus } = this.state;
      const { onAppearStart, onEnterStart, onLeaveStart, onAppearActive, onEnterActive, onLeaveActive, motionAppear, motionEnter, motionLeave } = this.props;
      if (!isSupportTransition(this.props)) {
        return
      }
      const $ele = this.getElement();
      if (this.$cacheEle !== $ele) {
        this.removeEventListener(this.$cacheEle);
        this.addEventListener($ele);
        this.$cacheEle = $ele;
      }
      if (newStatus && status === STATUS_APPEAR && motionAppear) {
        this.updateStatus(onAppearStart, null, null, () => {
          this.updateActiveStatus(onAppearActive, STATUS_APPEAR);
        })
      } else if (newStatus && status === STATUS_ENTER && motionEnter) {
        this.updateStatus(onEnterStart, null, null, () => {
          this.updateActiveStatus(onEnterActive, STATUS_ENTER);
        })
      } else if (newStatus && status === STATUS_LEAVE && motionLeave) {
        this.updateStatus(onLeaveStart, null, null, () => {
          this.updateActiveStatus(onLeaveActive, STATUS_LEAVE);
        })
      }
    }
    onMotionEnd = event => {
      const { status, statusActive } = this.state;
      const { onAppearEnd, onEnterEnd, onLeaveEnd } = this.props;
      if (status === STATUS_APPEAR && statusActive) {
        this.updateStatus(onAppearEnd, { status: STATUS_NONE }, event);
      } else if (status === STATUS_ENTER && statusActive) {
        this.updateStatus(onEnterEnd, { status: STATUS_NONE }, event);
      } else if (status === STATUS_LEAVE && statusActive) {
        this.updateStatus(onLeaveEnd, { status: STATUS_NONE }, event);
      }
    }
    setNodeRef = node => {
      const internalRef = this.props.internalRef;
      this.node = node;
      if (typeof internalRef === 'function') {
        internalRef(node);
      } else if (internalRef && 'current' in internalRef) {
        internalRef.current = node;
      }
    }
    addEventListener = $ele => {
      if (!$ele) return
      $ele.addEventListener(transitionEndName, this.onMotionEnd);
      $ele.addEventListener(animationEndName, this.onMotionEnd);
    }
    removeEventListener = $ele => {
      if (!$ele) return
      $ele.removeEventListener(transitionEndName, this.onMotionEnd);
      $ele.removeEventListener(animationEndName, this.onMotionEnd);
    }
    updateStatus = (styleFunc, additionalState, event, callback) => {
      const statusStyle = styleFunc ? styleFunc(this.getElement(), event) : null;
      if (statusStyle === false || this._destroyed) return
      let nextStep;
      if (callback) {
        nextStep = function nextStep() {
          this.nextFrame(callback);
        }
      }
      this.setState(Object.assign({
        statusStyle: typeof statusStyle === 'object' ? statusStyle : null,
        newStatus: false,
      }, additionalState), nextStep);
    }
    updateActiveStatus = (styleFunc, currentStatus) => {
      this.nextFrame(() => {
        if (this.state.status !== currentStatus) return;
        this.updateStatus(styleFunc, { statusActive: true });
      });
    }
    nextFrame = (func) => {
      this.cancelNextFrame();
      this.raf = raf(func);
    }
    cancelNextFrame = () => {
      if (this.raf) {
        raf.cancel(this.raf);
        this.raf = null;
      }
    }
    getElement = () => {
      return findDOMNode(this.node || this);
    }
    render() {
      const { status, statusActive, statusStyle } = this.state;
      const { children, motionName, visible, removeOnLeave, leavedClassName, eventProps } = this.props;
      if (!children) return null;
      if (status === STATUS_NONE || !isSupportTransition(this.props)) {
        if (visible) {
          return children(Object.assign({}, eventProps), this.setNodeRef);
        } else if (!removeOnLeave) {
          return children(Object.assign({}, eventProps, { className: leavedClassName }), this.setNodeRef)
        }
        return null;
      }
      let _classNames = {};
      const className = classNames((
        {},
        _defineProperty(_classNames, getTransitionName(motionName, status), status !== STATUS_NONE),
        _defineProperty(_classNames, getTransitionName(motionName, status + '-active'), status !== STATUS_NONE && statusActive),
        _defineProperty(_classNames, motionName, typeof motionName === 'string'),
        _classNames
      ))
      return children(Object.assign({}, eventProps, {
        className,
        style: statusStyle,
      }), this.setNodeRef)
    }
  }
  CSSMotion.defaultProps = {
    visible: true,
    motionEnter: true,
    motionAppear: true,
    motionLeave: true,
    removeOnLeave: true
  };
  CSSMotion.propTypes = {
    eventProps: PropTypes.object, // Internal usage. Only pass by CSSMotionList
    visible: PropTypes.bool,
    children: PropTypes.func,
    motionName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    motionAppear: PropTypes.bool,
    motionEnter: PropTypes.bool,
    motionLeave: PropTypes.bool,
    motionLeaveImmediately: PropTypes.bool, // Trigger leave motion immediately
    removeOnLeave: PropTypes.bool,
    leavedClassName: PropTypes.string,
    onAppearStart: PropTypes.func,
    onAppearActive: PropTypes.func,
    onAppearEnd: PropTypes.func,
    onEnterStart: PropTypes.func,
    onEnterActive: PropTypes.func,
    onEnterEnd: PropTypes.func,
    onLeaveStart: PropTypes.func,
    onLeaveActive: PropTypes.func,
    onLeaveEnd: PropTypes.func,
    internalRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
  }
  polyfill(CSSMotion)
  if (!forwardRef) {
    return CSSMotion;
  }
  return React.forwardRef(function(props, ref) {
    return React.createElement(CSSMotion, Object.assign({}, { internalRef: ref }, props));
  });
}

export default getCSSMotion(supportTransition);
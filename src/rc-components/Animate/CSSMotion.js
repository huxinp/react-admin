import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import raf from 'raf';
import {
  getTransitionName,
  animationEndName,
  transitionEndName,
  supportTransition,
} from './util/motion';

const STATUS_NONE = 'none';
const STATUS_APPEAR = 'appear';
const STATUS_ENTER = 'enter';
const STATUS_LEAVE = 'leave';

export const MotionPropTypes = {
  eventProps: PropTypes.object,
  visible: PropTypes.bool,
  children: PropTypes.func,
  motionName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  motionAppear: PropTypes.bool,
  motionEnter: PropTypes.bool,
  motionLeave: PropTypes.bool,
  motionLeaveImmediately: PropTypes.bool,
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
};

export function genCSSMotion(config) {
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
      super(props)
      this.onDomUpdate = this.onDomUpdate.bind(this);
      this.onMotionEnd = this.onMotionEnd.bind(this);
      this.setNodeRef = this.setNodeRef.bind(this);
      this.getElement = this.getElement.bind(this);
      this.addEventListener = this.addEventListener.bind(this);
      this.removeEventListener = this.removeEventListener.bind(this);
      this.updateStatus = this.updateStatus.bind(this);
      this.updateActiveStatus = this.updateActiveStatus.bind(this);
      this.nextFrame = this.nextFrame.bind(this);
      this.cancelNextFrame = this.cancelNextFrame.bind(this);
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
    getDerivedStateFromProps(props, _ref) {
      const prevProps = _ref.prevProps;
      const prevStatus = _ref.status;
      if (!isSupportTransition(props)) return {};
      const { visible, motionAppear, motionEnter, motionLeave, motionLeaveImmediately } = this.props;
      const newState = { prevProps: props };
      // Clean up status if prop set to false
      if (
        prevStatus === STATUS_APPEAR && !motionAppear
        || prevStatus === STATUS_ENTER && !motionEnter
        || prevStatus === STATUS_LEAVE && !motionLeave
      ) {
        newState.status = STATUS_NONE;
        newState.statusActive = false;
        newState.newStatus = false;
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
        prevProps && prevProps.visible && !visible && motionLeave
        || !prevProps && motionLeaveImmediately && !visible && motionLeave
      ) {
        newState.status = STATUS_LEAVE;
        newState.statusActive = false;
        newState.newStatus = true;
      }
      return newState;
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
    onDomUpdate() {
      const { status, newStatus } = this.state;
      const {
        onAppearStart, onEnterStart, onLeaveStart,
        onAppearActive, onEnterActive, onLeaveActive,
        motionAppear, motionEnter, motionLeave,
      } = this.props;
      if (!isSupportTransition(this.props)) return
      const $ele = this.getElement();
      if (this.$cacheEle !== $ele) {
        this.removeEventListener(this.$cacheEle);
        this.addEventListener($ele);
        this.$cacheEle = $ele;
      }
      if (newStatus && status === STATUS_APPEAR && motionAppear) {
        this.updateStatus(onAppearStart, null, null, function() {
          this.updateActiveStatus(onAppearActive, STATUS_APPEAR);
        })
      } else if (newStatus && status === STATUS_ENTER && motionEnter) {
        this.updateStatus(onEnterStart, null, null, function() {
          this.updateActiveStatus(onEnterActive, STATUS_ENTER);
        })
      } else if (newStatus && status === STATUS_LEAVE && motionLeave) {
        this.updateStatus(onLeaveStart, null, null, function() {
          this.updateActiveStatus(onLeaveActive, STATUS_LEAVE);
        })
      }
    }
    onMotionEnd(event) {
      const { status, statusActive } = this.state;
      const { onAppearEnd, onEnterEnd, onLeaveEnd } = this.props;
      if (status === STATUS_APPEAR && statusActive) {
        this.updateStatus(onAppearEnd, { status: STATUS_NONE }, event);
      } else if (status === STATUS_NONE && statusActive) {
        this.updateStatus(onEnterEnd, { status: STATUS_NONE }, event);
      } else if (status === STATUS_NONE && statusActive) {
        this.updateStatus(onLeaveEnd, { status: STATUS_NONE }, event);
      }
    }
    setNodeRef(node) {
      const internalRef = this.props.internalRef;
      this.node = node;
      if (typeof internalRef === 'function') {
        internalRef(node);
      } else if (internalRef && 'current' in internalRef) {
        internalRef.current = node;
      }
    }
    getElement() {
      return findDOMNode(this.node || this);
    }
    addEventListener($ele) {
      if (!$ele) return 
      $ele.addEventListener(transitionEndName, this.onMotionEnd);
      $ele.addEventListener(animationEndName, this.onMotionEnd);
    }
    removeEventListener($ele) {
      if (!$ele) return
      $ele.removeEventListener(transitionEndName, this.onMotionEnd);
      $ele.removeEventListener(animationEndName, this.onMotionEnd);
    }
    updateStatus(styleFunc, additionalState, event, callback) {
      const statusStyle = styleFunc ? styleFunc(this.getElement(), event) : null;
      if (statusStyle === false || this.destroyed) return;
      let nextStep = void 0;
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
    updateActiveStatus(styleFunc, currentStatus) {
      this.nextFrame(function() {
        const status = this.state.status;
        if (status !== currentStatus) return 
        this.updateStatus(styleFunc, { statusActive: true });
      });
    }
    nextFrame(func) {
      this.cancelNextFrame();
      this.raf = raf(func);
    }
    cancelNextFrame() {
      if (this.raf) {
        raf.cancel(this.raf);
        this.raf = null;
      }
    }
    render() {
      const { status, statusActive, statusStyle } = this.state;
      const { children, motionName, visible, removeOnLeave, leavedClassName, eventProps } = this.props;
      if (!children) return null;
      if (status === STATUS_NONE || !isSupportTransition(this.props)) {
        if (visible) {
          return children(Object.assign({}, eventProps), this.setNodeRef);
        } else if (!removeOnLeave) {
          return children(Object.assign({}, eventProps, { className: leavedClassName }), this.setNodeRef);
        }
        return null;
      }
      let className = classnames({
        [getTransitionName(motionName, status)]: status !== STATUS_NONE,
        [getTransitionName(motionName, status + '-active')]: status !== STATUS_NONE && statusActive,
        [motionName]: typeof motionName === 'string',
      });
      return children(Object.assign({}, eventProps, { className, style: statusStyle }), this.setNodeRef);
    }
  }
  CSSMotion.propTypes = Object.assign({}, MotionPropTypes, {
    internalRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  })
  CSSMotion.defaultProps = {
    visible: true,
    motionEnter: true,
    motionAppear: true,
    motionLeave: true,
    removeOnLeave: true,
  }
  if (!forwardRef) {
    return CSSMotion;
  }
  return React.forwardRef(function(props, ref) {
    return React.createElement(CSSMotion, Object.assign({}, { internalRef: ref }, props));
  });
}

export default genCSSMotion(supportTransition);

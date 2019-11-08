import React from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';
import classnames from 'classnames';
import addDomEventListener from 'add-dom-event-listener'
import Protal from './Protal';
import Popup from './Popup';
import ContainerRender from './ContainerRender';

function noop() {}
function returnEmptyString() {
  return '';
}
function returnDocument() {
  return window.document;
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
function getAlignFromPlacement(builtinPlacements, placementStr, align) {
  const baseAlign = builtinPlacements[placementStr] || {};
  return Object.assign({}, baseAlign, align);
}
function isPointsEq(a1, a2, isAlignPoint) {
  if (isAlignPoint) {
    return a1[0] === a2[0];
  }
  return a1[0] === a2[0] && a1[1] === a2[1];
}
function getAlignPopupClassName(builtinPlacements, prefixCls, align, isAlignPoint) {
  const points = align.points;
  for (let placement in builtinPlacements) {
    if (builtinPlacements.hasOwnProperty(placement)) {
      if (isPointsEq(builtinPlacements[placement].points, points, isAlignPoint)) {
        return prefixCls + '-placement-' + placement;
      }
    }
  }
  return '';
}
function addEventListener(target, eventType, cb, option) {
  const callback = ReactDom.unstable_batchedUpdates ? function run(e) {
    ReactDom.unstable_batchedUpdates(cb, e);
  } : cb;
  return addDomEventListener(target, eventType, callback, option);
}

const ALL_HANDLERS = ['onClick', 'onMouseDown', 'onTouchStart', 'onMouseEnter', 'onMouseLeave', 'onFocus', 'onBlur', 'onContextMenu'];

const IS_REACT_16 = !!ReactDom.createPortal;
const contextTypes = {
  rcTrigger: PropTypes.shape({
    onPopupMouseDown: PropTypes.func
  })
};
class Trigger extends React.Component {
  constructor(props) {
    super(props);
    let popupVisible;
    if ('popupVisible' in props) {
      popupVisible = !!props.popupVisible;
    } else {
      popupVisible = !!props.defaultPopupVisible;
    }
    this.state = {
      prevPopupVisible: popupVisible,
      popupVisible,
    }
    ALL_HANDLERS.forEach(handle => {
      this['fire' + handle] = e => {
        this.fireEvents(handle, e);
      }
    })
    this.onPopupMouseDown = this.onPopupMouseDown.bind(this);
  }
  componentDidMount() {
    this.componentDidUpdate({}, {
      popupVisible: this.state.popupVisible,
    });
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const triggerAfterPopupVisibleChange = function triggerAfterPopupVisibleChange() {
      if (prevState.popupVisible !== this.state.popupVisible) {
        this.props.afterPopupVisibleChange(this.state.popupVisible);
      }
    }
    if (!IS_REACT_16) {
      this.renderComponent(null, triggerAfterPopupVisibleChange);
    }
    if (this.state.popupVisible) {
      let currentDocument = void 0;
      if (!this.clickOutsideHandler && (this.isClickToHide() || this.isContextMenuToShow())) {
        currentDocument = this.props.getDocument();
        this.clickOutsideHandler = addEventListener(currentDocument, 'mousedown', this.onDocumentClick);
      }
      if (!this.touchOutsideHandler) {
        currentDocument = currentDocument || this.props.getDocument();
        this.touchOutsideHandler = addEventListener(currentDocument, 'touchstart', this.onDocumentClick);
      }
      if (!this.contextMenuOutsideHandler1 && this.isMouseEnterToShow()) {
        currentDocument = currentDocument || this.props.getDocument();
        this.contextMenuOutsideHandler1 = addEventListener(currentDocument, 'scroll', this.onContextMenuClose);
      }
      if (!this.contextMenuOutsideHandler2 && this.isMouseEnterToShow()) {
        currentDocument = currentDocument || this.props.getDocument();
        this.contextMenuOutsideHandler2 = addEventListener(window, 'blur', this.onContextMenuClose);
      }
      return
    }
    this.clearOutsideHandler();
  }
  componentWillUnmount() {
    this.clearDelayTimer();
    this.clearOutsideHandler();
    clearTimeout(this.mouseDownTimeout);
  }
  getDerivedStateFromProps(props, state) {
    const { popupVisible } = props;
    const newState = {};
    if (popupVisible !== undefined && state.popupVisible !== popupVisible) {
      newState.popupVisible = popupVisible;
      newState.prevPopupVisible = state.popupVisible;
    }
    return newState;
  }
  setPoint = point => {
    const alignPoint = this.props.alignPoint;
    if (!alignPoint || !point) return
    this.setState({
      point: {
        pageX: point.pageX,
        pageY: point.pageY,
      }
    })
  }
  savePopup = node => {
    this._component = node;
  }
  getContainer = () => {
    const popupContainer = document.createElement('div');
    popupContainer.style.position = 'absolute';
    popupContainer.style.top = '0';
    popupContainer.style.left = '0';
    popupContainer.style.width = '100%';
    const mountNode = this.props.getPopupContainer ? this.props.getPopupContainer(ReactDom.findDOMNode(this)) : this.props.getDocument().body;
    mountNode.apppendChild(popupContainer);
    return popupContainer;
  }
  getRootDomNode = () => {
    return ReactDom.findDOMNode(this);
  }
  setPopupVisible = (popupVisible, event) => {
    const alignPoint = this.props.alignPoint;
    const prevPopupVisible = this.state.popupVisible;
    this.clearDelayTimer();
    if (prevPopupVisible !== popupVisible) {
      if (!('popupVisible' in this.props)) {
        this.setState({ popupVisible, prevPopupVisible });
      }
      this.props.onPopupVisibleChange(popupVisible);
    }
    if (alignPoint && event) {
      this.setPoint(event);
    }
  }
  delaySetPopupVisible = (visible, delayS, event) => {
    const delay = delayS * 1000;
    this.clearDelayTimer();
    if (delay) {
      const point = event ? { pageX: event.pageX, pageY: event.pageY } : null;
      this.delayTimer = setTimeout(() => {
        this.setPopupVisible(visible, point);
        this.clearDelayTimer();
      }, delay);
    } else {
      this.setPopupVisible(visible, event);
    }
  }
  clearDelayTimer = () => {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
  }
  getChildContext = () => {
    return {
      rcTrigger: {
        onPopupMouseDown: this.onPopupMouseDown,
      }
    }
  }
  clearOutsideHandler = () => {
    if (this.clickOutsideHandler) {
      this.clickOutsideHandler.remove();
      this.clickOutsideHandler = null;
    }
    if (this.contextMenuOutsideHandler1) {
      this.contextMenuOutsideHandler1.remove();
      this.contextMenuOutsideHandler1 = null;
    }
    if (this.contextMenuOutsideHandler2) {
      this.contextMenuOutsideHandler2.remove();
      this.contextMenuOutsideHandler2 = null;
    }
    if (this.touchOutsideHandler) {
      this.touchOutsideHandler.remove();
      this.touchOutsideHandler = null;
    }
  }
  createTwoChains = event => {
    const childPros = this.props.children.props;
    if (childPros[event] && this.props[event]) {
      return this['fire' + event];
    }
    return childPros[event] || this.props[event];
  }
  isClickToShow = () => {
    const { action, showAction } = this.props;
    return action.indexOf('click') !== -1 || showAction.indexOf('click') !== -1;
  }
  isContextMenuToShow = () => {
    const { action, showAction } = this.props;
    return action.indexOf('contextMenu') !== -1 || showAction.indexOf('contextMenu') !== -1;
  }
  isClickToHide = () => {
    const { action, hideAction } = this.props;
    return action.indexOf('click') !== -1 || hideAction.indexOf('click') !== -1;
  }
  isMouseEnterToShow = () => {
    const { action, showAction } = this.props;
    return action.indexOf('hover') !== -1 || showAction.indexOf('mouseEnter') !== -1;
  }
  isMouseLeaveToHide = () => {
    const { action, hideAction } = this.props;
    return action.indexOf('hover') !== -1 || hideAction.indexOf('mouseLeave') !== -1;
  }
  isFocusToShow = () => {
    const { action, showAction } = this.props;
    return action.indexOf('focus') !== -1 || showAction.indexOf('focus') !== -1;
  }
  isBlurToHide = () => {
    const { action, hideAction } = this.props;
    return action.indexOf('focus') !== -1 || hideAction.indexOf('blur') !== -1;
  }
  close = () => {
    this.setPopupVisible(false);
  }
  fireEvents = (type, e) => {
    const childCallback = this.props.children.props[type];
    if (childCallback) {
      childCallback(e)
    }
    const callback = this.props[type]
    if (callback) {
      callback(e)
    }
  }
  focusPopupAlign = () => {
    if (this.state.popupVisible && this._component && this._component.alignInstance) {
      this._component.alignInstance.focusAlign();
    }
  }
  getPopupDomNode = () => {
    if (this._component && this._component.getPopupDomNode) {
      return this._component.getPopupDomNode();
    }
    return null
  }
  getPopupAlign = () => {
    const { popupPlacement, popupAlign, builtinPlacements } = this.props;
    if (popupPlacement && builtinPlacements) {
      return getAlignFromPlacement(builtinPlacements, popupPlacement, popupAlign);
    }
    return popupAlign;
  }
  onMouseEnter = e => {
    const mouseEnterDelay = this.props.mouseEnterDelay;
    this.fireEvents('onMouseEnter', e);
    this.delaySetPopupVisible(true, mouseEnterDelay, mouseEnterDelay ? null : e)
  }
  onMouseMove = e => {
    this.fireEvents('onMouseMove', e);
    this.setPoint(e)
  }
  onMouseLeave = e => {
    this.fireEvents('onMouseLeave', e);
    this.delaySetPopupVisible(false, this.props.mouseLeaveDelay);
  }
  onPopupMouseEnter = () => {
    this.clearDelayTimer();
  }
  onPopupMouseLeave = e => {
    if (e.relatedTarget && !e.relatedTarget.setTimeout && this._component && this._component.getPopupDomNode && contains(this._component.getPopupDomNode(), e.relatedTarget)) {
      return
    }
    this.delaySetPopupVisible(false, this.props.mouseLeaveDelay);
  }
  onFocus = e => {
    this.fireEvents('onFocus', e);
    this.clearDelayTimer();
    if (this.isFocusToShow()) {
      this.focusTime = Date.now();
      this.delaySetPopupVisible(true, this.props.focusDelay);
    }
  }
  onMouseDown = e => {
    this.fireEvents('onMouseDown', e);
    this.preClickTime = Date.now();
  }
  onTouseStart = e => {
    this.fireEvents('onTouseStart', e)
    this.preTouchTime = Date.now();
  }
  onBlur = e => {
    this.fireEvents('onBlur', e);
    this.clearDelayTimer();
    if (this.isBlurToHide()) {
      this.delaySetPopupVisible(false, this.props.blurDelay);
    }
  }
  onContextMenu = e => {
    e.preventDefault();
    this.fireEvents('onContextMenu', e);
    this.setPopupVisible(true, e);
  }
  onContextMenuClose = () => {
    if (this.isContextMenuToShow()) {
      this.close();
    }
  }
  onClick = e => {
    this.fireEvents('onClick', e);
    if (this.focusTime) {
      let preTime;
      if (this.preClickTime && this.preTouchTime) {
        preTime = Math.min(this.preClickTime, this.preTouchTime);
      } else if (this.preClickTime) {
        preTime = this.preClickTime;
      } else if (this.preTouchTime) {
        preTime = this.preTouchTime;
      }
      if (Math.abs(preTime - this.focusTime) < 20) {
        return
      }
      this.focusTime = 0;
    }
    this.preClickTime = 0;
    this.preTouchTime = 0;
    if (this.isClickToShow() && (this.isClickToHide() || this.isBlurToHide()) && e && e.preventDefault) {
      e.preventDefault();
    }
    const nextVisible = this.state.popupVisible;
    if (this.isClickToHide() && !nextVisible || nextVisible && this.isClickToShow()) {
      this.setPopupVisible(!this.state.popupVisible, e);
    }
  }
  onPopupMouseDown() {
    const context$rcTrigger = this.context.rcTrigger;
    const rcTrigger = context$rcTrigger === undefined ? {} : context$rcTrigger;
    this.hasPopupMouseDown = true;
    clearTimeout(this.mouseDownTimeout);
    this.mouseDownTimeout = setTimeout(() => this.hasPopupMouseDown = false, 0);
    if (rcTrigger.onPopupMouseDown) {
      rcTrigger.onPopupMouseDown.apply(rcTrigger, arguments);
    }
  }
  onDocumentClick = e => {
    if (this.props.mask && !this.props.maskClosable) {
      return
    }
    const target = e.target;
    const root = ReactDom.findDOMNode(this);
    if (contains(root, target) && this.hasPopupMouseDown) {
      this.close();
    }
  }
  getPopupClassNameFromAlign = align => {
    const className = [];
    const { popupPlacement, builtinPlacements, prefixCls, alignPoint, getPopupClassNameFromAlign } = this.props;
    if (popupPlacement && builtinPlacements) {
      className.push(getAlignPopupClassName(builtinPlacements, prefixCls, align, alignPoint));
    }
    if (getPopupClassNameFromAlign) {
      className.push(getPopupClassNameFromAlign(align));
    }
    return className.join(' ');
  }
  getComponent = () => {
    const {
      prefixCls, destroyPopupOnHide, popupClassName, action, onPopupAlign, popupAnimation, alignPoint,
      popupTransitionName, popupStyle, mask, maskAnimation, maskTransitionName, zIndex, popup, stretch
    } = this.props;
    const { popupVisible, point } = this.state;
    const align = this.getPopupAlign();
    const mouseProps = {};
    if (this.isMouseEnterToShow()) {
      mouseProps.onMouseEnter = this.onMouseEnter;
    }
    if (this.isMouseLeaveToHide()) {
      mouseProps.onMouseLeave = this.onMouseLeave;
    }
    mouseProps.onMouseDown = this.onMouseDown;
    mouseProps.onTouseStart = this.onTouseStart;
    return React.createElement(
      Popup,
      Object.assign({
        prefixCls, destroyPopupOnHide, visible: popupVisible, action,
        align, onAlign: onPopupAlign, animation: popupAnimation,
        getClassNameFromAlign: this.getPopupClassNameFromAlign
      }, mouseProps, {
        stretch, getRootDomNode: this.getRootDomNode, style: popupStyle, 
        mask, zIndex, transitionName: popupTransitionName,
        maskAnimation, maskTransitionName, ref: this.savePopup,
      }),
      typeof popup === 'function' ? popup() : popup
    )
  }
  handleProtalUpdate = () => {
    if (this.state.prevPopupVisible !== this.state.popupVisible) {
      this.props.afterPopupVisibleChange(this.state.popupVisible);
    }
  }
  render() {
    const { popupVisible } = this.state;
    const { children, forceRender, alignPoint, className } = this.props;
    const child = React.Children.only(children);
    const newChildProps = { key: 'trigger' };
    if (this.isContextMenuToShow()) {
      newChildProps.onContextMenu = this.onContextMenu;
    } else {
      newChildProps.onContextMenu = this.createTwoChains('onContextMenu');
    }
    if (this.isClickToHide() || this.isClickToShow()) {
      newChildProps.onClick = this.onClick;
      newChildProps.onMouseDown = this.onMouseDown;
      newChildProps.onTouseStart = this.onTouseStart;
    } else {
      newChildProps.onClick = this.createTwoChains('onClick');
      newChildProps.onMouseDown = this.createTwoChains('onMouseDown');
      newChildProps.onTouseStart = this.createTwoChains('onTouseStart');
    }
    if (this.isMouseEnterToShow()) {
      newChildProps.onMouseEnter = this.onMouseEnter;
      if (alignPoint) {
        newChildProps.onMouseMove = this.onMouseMove;
      }
    } else {
      newChildProps.onMouseEnter = this.createTwoChains('onMouseEnter');
    }
    if (this.isMouseLeaveToHide()) {
      newChildProps.onMouseLeave = this.onMouseLeave;
    } else {
      newChildProps.onMouseLeave = this.createTwoChains('onMouseLeave');
    }
    if (this.isBlurToHide() || this.isFocusToShow()) {
      newChildProps.onBlur = this.onBlur;
      newChildProps.onFocus = this.onFocus;
    } else {
      newChildProps.onBlur = this.createTwoChains('onBlur');
      newChildProps.onFocus = this.createTwoChains('onFocus');
    }
    const childrenClassname = classnames(child && child.props && child.props.className, className);
    if (childrenClassname) {
      newChildProps.className = childrenClassname;
    }
    const trigger = React.cloneElement(child, newChildProps);
    if (!IS_REACT_16) {
      return React.createElement(
        ContainerRender,
        {
          parent: this,
          visible: popupVisible,
          autoMount: false,
          forceRender,
          getContainer: this.getContainer,
        },
        function(props) {
          const renderComponent = props.renderComponent;
          this.renderComponent = renderComponent;
          return trigger;
        }
      )
    }
    let portal;
    if (popupVisible || this._component || forceRender) {
      portal = React.createElement(
        Protal,
        { key: 'portal', getContainer: this.getContainer, didUpdate: this.handleProtalUpdate },
        this.getComponent(),
      )
    }
    return [trigger, portal];
  }
}

Trigger.propTypes = {
  children: PropTypes.any,
  action: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  showAction: PropTypes.any,
  hideAction: PropTypes.any,
  getPopupClassNameFromAlign: PropTypes.any,
  onPopupVisibleChange: PropTypes.func,
  afterPopupVisibleChange: PropTypes.func,
  popup: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
  popupStyle: PropTypes.object,
  prefixCls: PropTypes.string,
  popupClassName: PropTypes.string,
  className: PropTypes.string,
  popupPlacement: PropTypes.string,
  builtinPlacements: PropTypes.object,
  popupTransitionName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  popupAnimation: PropTypes.any,
  mouseEnterDelay: PropTypes.number,
  mouseLeaveDelay: PropTypes.number,
  zIndex: PropTypes.number,
  focusDelay: PropTypes.number,
  blurDelay: PropTypes.number,
  getPopupContainer: PropTypes.func,
  getDocument: PropTypes.func,
  forceRender: PropTypes.bool,
  destroyPopupOnHide: PropTypes.bool,
  mask: PropTypes.bool,
  maskClosable: PropTypes.bool,
  onPopupAlign: PropTypes.func,
  popupAlign: PropTypes.object,
  popupVisible: PropTypes.bool,
  defaultPopupVisible: PropTypes.bool,
  maskTransitionName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  maskAnimation: PropTypes.string,
  stretch: PropTypes.string,
  alignPoint: PropTypes.bool // Maybe we can support user pass position in the future
};
Trigger.contextTypes = contextTypes;
Trigger.childContextTypes = contextTypes;
Trigger.defaultProps = {
  prefixCls: 'rc-trigger-popup',
  getPopupClassNameFromAlign: returnEmptyString,
  getDocument: returnDocument,
  onPopupVisibleChange: noop,
  afterPopupVisibleChange: noop,
  onPopupAlign: noop,
  popupClassName: '',
  mouseEnterDelay: 0,
  mouseLeaveDelay: 0.1,
  focusDelay: 0,
  blurDelay: 0.15,
  popupStyle: {},
  destroyPopupOnHide: false,
  popupAlign: {},
  defaultPopupVisible: false,
  mask: false,
  maskClosable: true,
  action: [],
  showAction: [],
  hideAction: []
};

export default Trigger;
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { findDOMNode, createPortal } from 'react-dom';
import addEventListener from '../util/Dom/addEventListener';
import ContainerRender from '../util/ContainerRender';
import Portal from '../util/Portal';
import {
  getAlignFromPlacement,
  getAlignPopupClassName,
} from './util';
import Popup from './Popup';

function noop() {}

function returnEmptyString() {
  return '';
}

function returnDocument() {
  return window.document;
}

const ALL_HANDLERS = [
  'onClick', 'onMouseDown', 'onTouchStart', 'onMouseEnter', 'onMouseLeave',
  'onFocus', 'onBlur', 'onContextMenu',
]

const IS_REACT_16 = !!createPortal;

const contextTypes = {
  rcTrigger: PropTypes.shape({
    onPopupMouseDown: PropTypes.func,
  })
}

export default class Trigger extends React.Component {
  constructor(props) {
    super(props);

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onPopupMouseEnter = this.onPopupMouseEnter.bind(this);
    this.onPopupMouseLeave = this.onPopupMouseLeave.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onContextMenu = this.onContextMenu.bind(this);
    this.onContextMenuClose = this.onContextMenuClose.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onPopupMouseDown = this.onPopupMouseDown.bind(this);
    this.onDocumentClick = this.onDocumentClick.bind(this);
    this.getRootDomNode = this.getRootDomNode.bind(this);
    this.getPopupClassNameFromAlign = this.getPopupClassNameFromAlign.bind(this);
    this.getComponent = this.getComponent.bind(this);
    this.getContainer = this.getContainer.bind(this);
    this.setPoint = this.setPoint.bind(this);
    this.handlePortalUpdate = this.handlePortalUpdate.bind(this);
    this.savePopup = this.savePopup.bind(this);
    this.getPopupDomNode = this.getPopupDomNode.bind(this);
    this.getPopupAlign = this.getPopupAlign.bind(this);
    this.setPopupVisible = this.setPopupVisible.bind(this);
    this.delaySetPopupVisible = this.delaySetPopupVisible.bind(this);
    this.clearDelayTimer = this.clearDelayTimer.bind(this);
    this.clearOutsideHandler = this.clearOutsideHandler.bind(this);
    this.createTwoChains = this.createTwoChains.bind(this);
    this.isClickToShow = this.isClickToShow.bind(this);
    this.isContextMenuToShow = this.isContextMenuToShow.bind(this);
    this.isClickToHide = this.isClickToHide.bind(this);
    this.isMouseEnterToShow = this.isMouseEnterToShow.bind(this);
    this.isMouseLeaveToHide = this.isMouseLeaveToHide.bind(this);
    this.isFocusToShow = this.isFocusToShow.bind(this);
    this.isBlurToHide = this.isBlurToHide.bind(this);
    this.forcePopupAlign = this.forcePopupAlign.bind(this);
    this.fireEvents = this.fireEvents.bind(this);
    this.close = this.close.bind(this);

    let popupVisible = void 0;
    if ('popupVisible' in props) {
      popupVisible = !!props.popupVisible;
    } else {
      popupVisible = !!props.defaultPopupVisible;
    }
    this.state = {
      prevPopupVisible: popupVisible,
      popupVisible: popupVisible,
    }
    ALL_HANDLERS.forEach(h => {
      this['fire' + h] = function(e) {
        this.fireEvents(h, e);
      }
    });
  }
  getChildContext() {
    return {
      rcTrigger: {
        onPopupMouseDown: this.onPopupMouseDown,
      }
    }
  }
  componentDidMount() {

  }
  componentDidUpdate(_, prevState) {
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
      if (!this.contextMenuOutsideHandler1 && this.isContextMenuToShow()) {
        currentDocument = currentDocument || this.props.getDocument();
        this.contextMenuOutsideHandler1 = addEventListener(currentDocument, 'scroll', this.onContextMenuClose);
      }
      if (!this.contextMenuOutsideHandler2 && this.isContextMenuToShow()) {
        this.contextMenuOutsideHandler2 = addEventListener(window, 'blur', this.onContextMenuClose);
      }
      return
    }
    this.clearOutsideHandler();
  }
  componentWillUnmount() {

  }
  getDerivedStateFromProps(props, prevState) {

  }
  onMouseEnter(e) {

  }
  onMouseMove(e) {

  }
  onMouseLeave(e) {

  }
  onPopupMouseEnter(e) {

  }
  onPopupMouseLeave(e) {

  }
  onFocus(e) {

  }
  onMouseDown(e) {

  }
  onTouchStart(e) {

  }
  onBlur(e) {

  }
  onContextMenu(e) {

  }
  onContextMenuClose() {

  }
  onClick() {

  }
  onPopupMouseDown() {

  }
  onDocumentClick() {

  }
  getRootDomNode() {
    return findDOMNode(this);
  }
  getPopupClassNameFromAlign(align) {
    const className = [];
    const { popupPlacement, builtinPlacements, prefixCls, alignPoint, getPopupClassNameFromAlign } = this.props;
    if (popupPlacement && builtinPlacements) {
      className.push(getAlignFromPlacement(builtinPlacements, prefixCls, align, alignPoint));
    }
    if (getPopupClassNameFromAlign) {
      className.push(getPopupClassNameFromAlign(align));
    }
    return className.join(' ');
  }
  getComponent() {
    const {
      prefixCls, destroyPopupOnHide, popupClassName, action, onPopupAlign, popupAnimation, alignPoint,
      popupTransitionName, popupStyle, mask, maskAnimation, maskTransitionName, zIndex, popup, stretch,
    } = this.props;
    const { popupVisible, point } = this.state;
    const align = this.getPopupAlign();
    const mouseProps = {};

    mouseProps.onMouseDown = this.onPopupMouseDown;
    mouseProps.onTouchStart = this.onPopupMouseDown;

    return React.createElement(
      Popup,
      Object.assign({
        prefixCls,
        destroyPopupOnHide,
        visible: popupVisible,
        point: alignPoint && point,
        className: popupClassName,
        action,
        align,
        onAlign: onPopupAlign,
        animation: popupAnimation,
        getClassNameFromAlign: this.getPopupClassNameFromAlign,
      }, mouseProps, {
        stretch,
        getRootDomNode: this.getRootDomNode,
        style: popupStyle,
        mask,
        zIndex,
        transitionName: popupTransitionName,
        maskAnimation,
        maskTransitionName,
        ref: this.savePopup,
      }),
      typeof popup === 'function' ? popup() : popup
    );
  }
  getContainer() {
    const { getPopupContainer, getDocument } = this.props;
    const popupContainer = document.createElement('div');
    popupContainer.style.position = 'absolute';
    popupContainer.style.top = '0';
    popupContainer.style.left = '0';
    popupContainer.style.width = '100%';
    const mountNode = getPopupContainer ? getPopupContainer(findDOMNode(this)) : getDocument().body;
    mountNode.appendChild(popupContainer);
    return popupContainer;
  }
  getPopupDomNode() {
    if (this.component && this.component.getPopupDomNode) {
      return this.component.getPopupDomNode();
    }
    return null;
  }
  setPoint(point) {
    const { alignPoint } = this.props;
    if (!alignPoint || !point) return
    this.setState({
      point: {
        pageX: point.pageX,
        pageY: point.pageY,
      }
    })
  }
  handlePortalUpdate() {
    if (this.state.prevPopupVisible !== this.state.popupVisible) {
      this.props.afterPopupVisibleChange(this.state.popupVisible);
    }
  }
  savePopup(node) {
    this.component = node;
  }
  getPopupAlign() {
    const { popupPlacement, popupAlign, builtinPlacements } = this.props;
    if (popupPlacement && builtinPlacements) {
      return getAlignFromPlacement(builtinPlacements, popupPlacement, popupAlign);
    }
    return popupAlign;
  }
  setPopupVisible(popupVisible, event) {

  }
  delaySetPopupVisible(visible, delays, event) {

  }
  clearDelayTimer() {
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }
  }
  clearOutsideHandler() {
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
  createTwoChains(event) {
    const props = this.props;
    const childProps = props.children.props;
    if (childProps[event] && props[event]) {
      return this['fire' + event];
    }
    return childProps[event] || props[event];
  }
  isClickToShow() {
    const { action, showAction } = this.props;
    return action.indexOf('click') !== -1 || showAction.indexOf('click') !== -1;
  }
  isContextMenuToShow() {
    const { action, showAction } = this.props;
    return action.indexOf('contextMenu') !== -1 || showAction.indexOf('contextMenu') !== -1;
  }
  isClickToHide() {
    const { action, hideAction } = this.props;
    return action.indexOf('click') !== -1 || hideAction.indexOf('click') !== -1;
  }
  isMouseEnterToShow() {
    const { action, showAction } = this.props;
    return action.indexOf('hover') !== -1 || showAction.indexOf('mouseEnter') !== -1;
  }
  isMouseLeaveToHide() {
    const { action, hideAction } = this.props;
    return action.indexOf('hover') !== -1 || hideAction.indexOf('mouseLeave') !== -1;
  }
  isFocusToShow() {
    const { action, showAction } = this.props;
    return action.indexOf('focus') !== -1 || showAction.indexOf('focus') !== -1;
  }
  isBlurToHide() {
    const { action, hideAction } = this.props;
    return action.indexOf('focus') !== -1 || hideAction.indexOf('blur') !== -1;
  }
  forcePopupAlign() {

  }
  fireEvents(type, e) {

  }
  close() {

  }
  render() {
    const { popupVisible } = this.state;
    const { children, forceRender, alignPoint, className } = this.props;
    const child = React.Children.only(children);
    const newChildProps = { key: 'trigger' };
    const childrenClassName = classnames(child && child.props && child.props.className, className);
    if (childrenClassName) {
      newChildProps.className = childrenClassName;
    }
    const trigger = React.cloneElement(child, newChildProps);
    if (!IS_REACT_16) {
      return React.createElement(
        ContainerRender,
        {
          parent: this,
          visible: popupVisible,
          autoMount: false,
          forceRender: forceRender,
          getComponent: this.getComponent,
          getContainer: this.getContainer,
        },
        function (props) {
          this.renderComponent = props.renderComponent;
          return trigger;
        }
      )
    }
    let portal = void 0;
    if (popupVisible || this.component || forceRender) {
      portal = React.createElement(
        Portal,
        { key: 'portal', getContainer: this.getContainer, didUpdate: this.handlePortalUpdate },
        this.getComponent()
      )
    }
    return [trigger, portal];
  }
}

Trigger.propTypes = {
  children: PropTypes.any,
  action: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  showAction: PropTypes.any,
  hideAction: PropTypes.any,
  getPopupClassNameFromAlign: PropTypes.any,
  onPopupVisibleChange: PropTypes.func,
  afterPopupVisibleChange: PropTypes.func,
  popup: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ]).isRequired,
  popupStyle: PropTypes.object,
  prefixCls: PropTypes.string,
  popupClassName: PropTypes.string,
  className: PropTypes.string,
  popupPlacement: PropTypes.string,
  builtinPlacements: PropTypes.object,
  popupTransitionName: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
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
  maskCloseable: PropTypes.bool,
  onPopupAlign: PropTypes.func,
  popupAlign: PropTypes.object,
  popupVisible: PropTypes.bool,
  defaultPopupVisible: PropTypes.bool,
  maskTransitionName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  maskAnimation: PropTypes.string,
  stretch: PropTypes.string,
  alignPoint: PropTypes.bool,
}
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
  maskCloseable: true,
  action: [],
  showAction: [],
  hideAction: [],
}

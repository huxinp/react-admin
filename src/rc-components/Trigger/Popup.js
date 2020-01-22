import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Align from '../Align';
import Animate from '../Animate';
import PopupInner from './PopupInner';
import LazyRenderBox from './LazyRenderBox';
import { saveRef } from './utils';

export default class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.savePopupRef = saveRef.bind(this, 'popupInstance');
    this.saveAlignRef = saveRef.bind(this, 'alignInstance');
    this.getPopupDomNode = this.getPopupDomNode.bind(this);
    this.getMaskTransitionName = this.getMaskTransitionName.bind(this);
    this.getTransitionName = this.getTransitionName.bind(this);
    this.getClassName = this.getClassName.bind(this);
    this.getPopupElement = this.getPopupElement.bind(this);
    this.getZIndexStyle = this.getZIndexStyle.bind(this);
    this.getMaskElement = this.getMaskElement.bind(this);
    this.onAlign = this.onAlign.bind(this);
    this.setStretchSize = this.setStretchSize.bind(this);
    this.getTargetElement = this.getTargetElement.bind(this);
    this.getAlignTarget = this.getAlignTarget.bind(this);
    this.state = {
      stretchChecked: false,
      targetWidth: undefined,
      targetHeight: undefined,
    }
  }
  componentDidMount() {
    this.rootNode = this.getPopupDomNode();
    this.setStretchSize();
  }
  componentDidUpdate() {
    this.setStretchSize();
  }
  onAlign(popupDomNode, align) {

  }
  setStretchSize() {
    const { stretch, getRootDomNode, visible } = this.props;
    const { stretchChecked, targetHeight, targetWidth } = this.state;
    if (!stretch || !visible) {
      if (stretchChecked) {
        this.setState({ stretchChecked: false })
      }
      return
    }
    const $ele = getRootDomNode();
    if (!$ele) return
    const height = $ele.offsetHeight;
    const width = $ele.offsetWidth;

    if (targetHeight !== height || targetWidth !== width || !stretchChecked) {
      this.setState({
        stretcheChecked: true,
        targetHeight: height,
        targetWidth: width,
      })
    }
  }
  getTargetElement() {
    return this.props.getRootDomNode();
  }
  getAlignTarget() {
    const point = this.props.point;
    if (point) {
      return point;
    }
    return this.getTargetElement;
  }
  getPopupDomNode() {
    return ReactDOM.findDOMNode(this.popupInstance);
  }
  getMaskTransitionName() {
    let { maskTransitionName, maskAnimation, prefixCls } = this.props;
    if (!maskTransitionName && maskAnimation) {
      maskTransitionName = prefixCls + '-' + maskAnimation;
    }
    return maskTransitionName;
  }
  getTransitionName() {
    let { transitionName, animation, prefixCls } = this.props;
    if (!transitionName && animation) {
      transitionName = prefixCls + '-' + animation;
    }
    return transitionName;
  }
  getClassName(currentAlignClassName) {
    return this.props.prefixCls + ' ' + this.props.className + ' ' + currentAlignClassName;
  }
  getPopupElement() {
    const {
      align, visible, prefixCls, style, getClassNameFromAlign, onTouchStart,
      destroyPopupOnHide, stretch, children, onMouseEnter, onMouseLeave, onMouseDown,
    } = this.props;
    const { stretchChecked, targetHeight, targetWidth } = this.state;
    const savePopupRef = this.savePopupRef;
    const className = this.getClassName(this.currentAlignClassName || getClassNameFromAlign(align))
    const hiddenClassName = prefixCls + '-hidden';
    if (!visible) {
      this.currentAlignClassName = null;
    }
    const sizeStyle = {};
    if (stretch) {
      if (stretch.indexOf('height') !== -1) {
        sizeStyle.height = targetHeight;
      } else if (stretch.indexOf('minHeight') !== -1) {
        sizeStyle.minHeight = targetHeight;
      }
      if (stretch.indexOf('width') !== -1) {
        sizeStyle.width = targetWidth;
      } else if (stretch.indexOf('minWidth') !== -1) {
        sizeStyle.minWidth = targetWidth;
      }
      if (!stretchChecked) {
        sizeStyle.visibility = 'hidden';
        setTimeout(function() {
          if (this.alignInstance) {
            this.alignInstance.forceAlign();
          }
        }.bind(this), 0);
      }
    }
    const newStyle = Object.assign({}, sizeStyle, style, this.getZIndexStyle());
    const popupInnerProps = {
      className,
      prefixCls,
      ref: savePopupRef,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onTouchStart,
      style: newStyle,
    };
    if (destroyPopupOnHide) {
      return React.createElement(
        Animate,
        {
          component: '',
          exclusive: true,
          transitionAppear: true,
          transitionName: this.getTransitionName(),
        },
        visible ? React.createElement(
          Align,
          {
            target: this.getAlignTarget(),
            key: 'popup',
            ref: this.saveAlignRef,
            monitorWindowResize: true,
            align,
            onAlign: this.onAlign,
          },
          React.createElement(
            PopupInner,
            { visible: true, ...popupInnerProps },
            children
          )
        ) : null
      )
    }
    return React.createElement(
      Animate,
      {
        component: '',
        exclusive: true,
        transitionAppear: true,
        transitionName: this.getTransitionName(),
        showProp: 'xVisible'
      },
      React.createElement(
        Align,
        {
          target: this.getAlignTarget(),
          key: 'popup',
          ref: this.saveAlignRef,
          monitorWindowResize: true,
          xVisible: visible,
          childrenProps: { visible: 'xVisible' },
          disabled: !visible,
          align,
          onAlign: this.onAlign,
        },
        React.createElement(
          PopupInner,
          { hiddenClassName, ...popupInnerProps },
          children,
        )
      )
    )
  }
  getZIndexStyle() {
    const style = {};
    if (this.props.zIndex !== undefined) {
      style.zIndex = this.props.zIndex;
    }
    return style;
  }
  getMaskElement() {
    const { mask, prefixCls, visible } = this.props.mask;
    let maskElement = void 0;
    if (mask) {
      const maskTransition = this.getMaskTransitionName();
      maskElement = React.createElement(LazyRenderBox, {
        style: this.getZindexStyle(),
        key: 'mask',
        className: prefixCls + '-mask',
        hiddenClassName: prefixCls + '-mask-hidden',
        visible,
      });
      if (maskTransition) {
        maskElement = React.createElement(
          Animate,
          {
            key: 'mask',
            showProp: 'visible',
            transitionAppear: true,
            component: '',
            transitionName: maskTransition,
          },
          maskElement
        )
      }
    }
    return maskElement;
  }
  render() {
    return React.createElement(
      'div',
      null,
      this.getMaskElement(),
      this.getPopupElement(),
    )
  }
}

Popup.propTypes = {
  visible: PropTypes.bool,
  style: PropTypes.object,
  getClassNameFromAlign: PropTypes.func,
  onAlign: PropTypes.func,
  getRootDomNode: PropTypes.bool,
  align: PropTypes.any,
  destroyPopupOnHide: PropTypes.bool,
  className: PropTypes.string,
  prefixCls: PropTypes.string,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onTouchStart: PropTypes.func,
  onMouseDown: PropTypes.func,
  stretch: PropTypes.string,
  children: PropTypes.node,
  point: PropTypes.shape({
    pageX: PropTypes.number,
    pageY: PropTypes.number,
  }),
};

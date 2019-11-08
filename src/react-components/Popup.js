import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import PopupInner from './PopupInner';
import LazyRenderBox from './LazyRenderBox';
import Animate from './Animate';
import Align from './Align';

class Popup extends React.Component {
  constructor(props) {
    super(props)
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

  onAlign = (popupDomNode, align) => {
    const currentAlignClassName = this.props.getClassNameFromAlign(align)
    if (this.currentAlignClassName !== currentAlignClassName) {
      this.currentAlignClassName = currentAlignClassName;
      popupDomNode.className = this.getClassName(currentAlignClassName);
    }
    this.props.onAlign(popupDomNode, align);
  }
  setStretchSize = () => {
    const { stretch, getRootDomNode, visible } = this.props;
    const { stretchChecked, targetHeight, targetWidth } = this.state;
    if (!stretch || !visible) {
      if (stretchChecked) {
        this.setState({ stretchChecked: false });
      }
      return
    }
    const $ele = getRootDomNode();
    if (!$ele) return
    const height = $ele.offsetHeight;
    const width = $ele.offsetWidth;
    if (targetHeight !== height || targetWidth !== width || !stretchChecked) {
      this.setState({
        stretchChecked: true,
        targetHeight: height,
        targetWidth: width,
      })
    }
  }
  getTargetElement = () => {
    return this.props.getRootDomNode();
  }
  getAlignTarget = () => {
    const point = this.props.point;
    if (point) return point;
    return this.getTargetElement;
  }

  getPopupDomNode = () => {
    ReactDOM.findDOMNode(this.popupInstance);
  }
  getMaskTransitionName = () => {
    let { maskTransitionName, maskAnimation } = this.props;
    if (!maskTransitionName && maskAnimation) {
      maskTransitionName = this.props.prefixCls + '-' + maskAnimation;
    }
    return maskTransitionName;
  }
  getClassName = (currentAlignClassName) => {
    return this.props.prefixCls + ' ' + this.props.className + ' ' + currentAlignClassName;
  }
  getPopupElement = () => {
    const { stretchChecked, targetHeight, targetWidth } = this.state;
    const {
      align, visible, getClassNameFromAlign, destroyPopupOnHide, style, prefixCls, children, stretch,
      onMouseDown, onMouseEnter, onMouseLeave, onTouchStart,
    } = this.props;
    const className = this.getClassName(this.currentAlignClassName || getClassNameFromAlign(align));
    const hiddenClassName = prefixCls + '-hidden';
    if (!visible) {
      this.currentAlignClassName = '';
    }
    const sizeStyle = {};
    if (stretch) {
      if (stretch.indexOf('height') > -1) {
        sizeStyle.height = targetHeight;
      } else if (stretch.indexOf('minHeight') > -1) {
        sizeStyle.minHeight = targetHeight;
      }
      if (stretch.indexOf('width') > -1) {
        sizeStyle.width = targetWidth;
      } else if (stretch.indexOf('minWidth') > -1) {
        sizeStyle.minWidth = targetWidth;
      }
      if (!stretchChecked) {
        sizeStyle.visibility = 'hidden';
        setTimeout(() => {
          this.alignInstance && this.alignInstance.forceAlign();
        }, 0)
      }
    }
    const newStyle = Object.assign({}, sizeStyle, style, this.getZIndexStyle());
    const popupInnerProps = {
      className,
      prefixCls,
      ref: node => this.popupInstance = node,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onTouchStart,
      style: newStyle,
    }
    if (destroyPopupOnHide) {
      return React.createElement(
        Animate,
        {
          component: '',
          exclusive: true,
          transitionAppear: true,
          transitionName: this.getTransitionName()
        },
        visible ? React.createElement(
          Align,
          {
            target: this.getAlignTarget(),
            key: 'popup',
            ref: node => this.alignInstance = node,
            monitorWindowResize: true,
            align,
            onAlign: this.onAlign,
          },
          React.createElement(
            PopupInner,
            Object.assign({}, { visible: true }, popupInnerProps),
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
          ref: node => this.alignInstance = node,
          monitorWindowResize: true,
          xVisible: visible,
          childrenProps: { visible: 'xVisible' },
          disable: !visible,
          align,
          onAlign: this.onAlign,
        },
        React.createElement(
          PopupInner,
          Object.assign({}, { hiddenClassName }, popupInnerProps),
          children
        )
      )
    )
  }
  getZIndexStyle = () => {
    const style = {};
    const { zIndex } = this.props;
    if (zIndex !== undefined) {
      style.zIndex = zIndex;
    }
    return style;
  }
  getMaskElement = () => {
    const { prefixCls, mask, visible } = this.props;
    let maskElement;
    if (mask) {
      const maskTransition = this.getMaskTransitionName();
      maskElement = React.createElement(
        LazyRenderBox,
        {
          style: this.getZIndexStyle(),
          key: 'mask',
          className: prefixCls + '-mask',
          hiddenClassName: prefixCls + '-mask-hidden',
          visible,
        }
      );
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
      this.getPopupElement()
    )
  }
}
Popup.propTypes = {
  visible: PropTypes.bool,
  style: PropTypes.object,
  getClassNameFromAlign: PropTypes.func,
  onAlign: PropTypes.func,
  getRootDomNode: PropTypes.func,
  align: PropTypes.any,
  destroyPopupOnHide: PropTypes.bool,
  className: PropTypes.string,
  prefixCls: PropTypes.string,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseDown: PropTypes.func,
  onTouchStart: PropTypes.func,
  stretch: PropTypes.string,
  children: PropTypes.node,
  point: PropTypes.shape({
    pageX: PropTypes.number,
    pageY: PropTypes.number
  })
}

// _initialiseProps

export default Popup;
import React from 'react';
import PropTypes from 'prop-types';
import {
  toArrayChildren,
  mergeChildren,
  findShownChildInChildrenByKey,
  findChildInChildrenByKey,
  isSameChildren,
} from './ChildrenUtils';
import AnimateChild from './AnimateChild';
import animUtil from './util/animate';

const defaultKey = 'rc_animate_' + Date.now();

function getChildrenFromProps(props) {
  const children = props.children;
  if (React.isValidElement(children)) {
    if (!children.key) {
      return React.cloneElement(children, {
        key: defaultKey,
      });
    }
  }
  return children;
}

function noop() {}

export default class Animate extends React.Component {
  constructor(props) {
    super(props);
    this.isValidChildByKey = this.isValidChildByKey.bind(this);
    this.stop = this.stop.bind(this);
    this.performAppear = this.performAppear.bind(this);
    this.handleDoneAdding = this.handleDoneAdding.bind(this);
    this.performEnter = this.performEnter.bind(this);
    this.performLeave = this.performLeave.bind(this);
    this.handleDoneLeaving = this.handleDoneLeaving.bind(this);
    this.state = {
      children: toArrayChildren(getChildrenFromProps(props)),
    };
    this.currentlyAnimatingKeys = {};
    this.keysToEnter = [];
    this.keysToLeave = [];
    this.childrenRefs = {};
  }
  componentDidMount() {
    const { showProp } = this.props;
    let { children } = this.state;
    if (showProp) {
      children = children.filter(function(child) {
        return !!child.props[showProp];
      });
    }
    children.forEach(function(child) {
      if (child) {
        this.performAppear(child.key);
      }
    })
  }
  componentWillReceiveProps(nextProps) {
    this.nextProps = nextProps;
    const _this = this;
    const nextChildren = toArrayChildren(getChildrenFromProps(nextProps));
    if (this.props.exclusive) {
      Object.keys(this.currentlyAnimatingKeys).forEach(function(key) {
        this.stop(key);
      })
    }
    const showProp = this.props.showProp;
    const currentlyAnimatingKeys = this.currentlyAnimatingKeys;
    // last props children if exclusive
    const currentChildren = this.props.exclusive ? toArrayChildren(getChildrenFromProps(this.props)) : this.state.children;
    // in case destroy in showProp mode
    let newChildren = [];
    if (showProp) {
      currentChildren.forEach(function(currentChild) {
        const nextChild = currentChild && findChildInChildrenByKey(newChildren, currentChild.key);
        let newChild = void 0;
        if (
          (!nextChild || !nextChild.props[showProp])
          && currentChild.props[showProp]
        ) {
          newChild = React.cloneElement(nextChild || currentChild, { [showProp]: true });
        } else {
          newChild = nextChild;
        }
        if (newChild) {
          newChildren.push(newChild);
        }
      });
      nextChildren.forEach(function(nextChild) {
        if (!nextChild || !findChildInChildrenByKey(currentChildren, nextChild.key)) {
          newChildren.push(nextChild);
        }
      });
    } else {
      newChildren = mergeChildren(currentChildren, nextChildren);
    }
    // need render to avoid update
    this.setState({
      children: newChildren
    });
    nextChildren.forEach(function(child) {
      const key = child && child.key;
      if (child && currentlyAnimatingKeys[key]) return
      const hasPrev = child && findChildInChildrenByKey(currentChildren, key);
      if (showProp) {
        const showInNext = child.props[showProp];
        if (hasPrev) {
          const showInNow = findShownChildInChildrenByKey(currentChildren, key, showProp);
          if (!showInNow && showInNext) {
            _this.keysToEnter.push(key);
          }
        } else if (showInNext) {
          _this.keysToEnter.push(key);
        }
      } else if (!hasPrev) {
        _this.keysToEnter.push(key);
      }
    });
    currentChildren.forEach(function(child) {
      const key = child && child.key;
      if (child && currentlyAnimatingKeys[key]) return
      const hasNext = child && findChildInChildrenByKey(nextChildren, key);
      if (showProp) {
        const showInNow = child.props[showProp];
        if (hasNext) {
          const showInNext = findShownChildInChildrenByKey(nextChildren, key, showProp);
          if (!showInNext && showInNow) {
            _this.keysToLeave.push(key);
          }
        } else if (showInNow) {
          _this.keysToLeave.push(key);
        }
      } else if (!hasNext) {
        _this.keysToLeave.push(key);
      }
    })
  }
  componentDidUpdate() {
    const keysToEnter = this.keysToEnter;
    this.keysToEnter = [];
    keysToEnter.forEach(this.performEnter);
    const keysToLeave = this.keysToLeave;
    this.keysToLeave = [];
    keysToLeave.forEach(this.performLeave);
  }
  isValidChildByKey(currentChildren, key) {
    const showProp = this.props.showProp;
    if (showProp) {
      return findShownChildInChildrenByKey(currentChildren, key, showProp);
    }
    return findChildInChildrenByKey(currentChildren, key);
  }
  stop(key) {
    delete this.currentlyAnimatingKeys[key];
    const component = this.childrenRefs[key];
    if (component) {
      component.stop();
    }
  }
  performEnter(key) {
    if (this.childrenRefs[key]) {
      this.currentlyAnimatingKeys[key] = true;
      this.childrenRefs[key].componentWillEnter(this.handleDoneAdding.bind(this, key, 'enter'));
    }
  }
  performAppear(key) {
    if (this.childrenRefs[key]) {
      this.currentlyAnimatingKeys[key] = true;
      this.childrenRefs[key].componentWillAppear(this.handleDoneAdding.bind(this, key, 'appear'))
    }
  }
  handleDoneAdding(key, type) {
    delete this.currentlyAnimatingKeys[key];
    if (this.props.exclusive && this.props !== this.nextProps) return;
    const currentChildren = toArrayChildren(getChildrenFromProps(this.props));
    if (!this.isValidChildByKey(currentChildren, key)) {
      this.performLeave(key);
    } else if (type === 'appear') {
      if (animUtil.allowAppearCallback(this.props)) {
        this.props.onAppear(key);
        this.props.onEnd(key, true);
      }
    } else if (animUtil.allowEnterCallback(this.props)) {
      this.props.onEnter(key);
      this.props.onEnd(key, true);
    }
  }
  performLeave(key) {
    if (this.childrenRefs[key]) {
      this.currentlyAnimatingKeys[key] = true;
      this.childrenRefs[key].componentWillLeave(this.handleDoneLeaving.bind(this, key))
    }
  }
  handleDoneLeaving(key) {
    delete this.currentlyAnimatingKeys[key];
    if (this.props.exclusive && this.props !== this.nextProps) return
    const currentChildren = toArrayChildren(getChildrenFromProps(this.props));
    if (this.isValidChildByKey(currentChildren, key)) {
      this.performEnter(key);
    } else {
      const end = (function end() {
        if (animUtil.allowLeaveCallback(this.props)) {
          this.props.onLeave(key);
          this.props.onEnd(key, false);
        }
      }).bind(this);
      if (!isSameChildren(this.state.children, currentChildren, this.props.showProp)) {
        this.setState({
          children: currentChildren
        }, end);
      } else {
        end();
      }
    }
  }
  render() {
    this.nextProps = this.props;
    const stateChildren = this.state.children;
    let children = null;
    const _this = this;
    if (stateChildren) {
      children = stateChildren.map(function(child) {
        if (child === null || child === undefined) {
          return child;
        }
        if (!child.key) {
          throw new Error('must set key for <rc-animate> children');
        }
        const {
          animation,
          transitionName,
          transitionAppear,
          transitionEnter,
          transitionLeave,
        } = _this.props;
        return React.createElement(
          AnimateChild,
          {
            key: child.key,
            ref: function ref(node) {
              _this.childrenRefs[child.key] = node;
            },
            animation,
            transitionName,
            transitionAppear,
            transitionEnter,
            transitionLeave,
          },
          child
        )
      })
    }
    const Component = this.props.component;
    if (Component) {
      let passedProps = this.props;
      if (typeof Component === 'string') {
        passedProps = Object.assign({
          className: this.props.className,
          style: this.props.style,
        }, this.props.componentProps);
      }
      return React.createElement(
        Component,
        passedProps,
        children,
      );
    }
    return children[0] || null;
  }
}

Animate.isAnimate = true;
Animate.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  component: PropTypes.any,
  componentProps: PropTypes.object,
  animation: PropTypes.object,
  transitionName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  transitionEnter: PropTypes.bool,
  transitionAppear: PropTypes.bool,
  exclusive: PropTypes.bool,
  transitionLeave: PropTypes.bool,
  onEnd: PropTypes.func,
  onEnter: PropTypes.func,
  onLeave: PropTypes.func,
  onAppear: PropTypes.func,
  showProp: PropTypes.string,
  children: PropTypes.node,
}
Animate.defaultProps = {
  animation: {},
  component: 'span',
  componentProps: {},
  transitionEnter: true,
  transitionLeave: true,
  transitionAppear: false,
  onEnd: noop,
  onEnter: noop,
  onLeave: noop,
  onAppear: noop,
};

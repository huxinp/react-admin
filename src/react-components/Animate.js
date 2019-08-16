import React from 'react';
import PropTypes, { func } from 'prop-types';

import AnimateChild from './AnimateChild';
const util = {
  isAppearSupported: function isAppearSupported(props) {
    return props.transitionName && props.transitionAppear || props.animation.appear;
  },
  isEnterSupported: function isEnterSupported(props) {
    return props.transitionName && props.transitionEnter || props.animation.enter;
  },
  isLeaveSupported: function isLeaveSupported(props) {
    return props.transitionName && props.transitionLeave || props.animation.leave;
  },
  allowAppearCallback: function allowAppearCallback(props) {
    return props.transitionAppear || props.animation.appear;
  },
  allowEnterCallback: function allowEnterCallback(props) {
    return props.transitionEnter || props.animation.enter;
  },
  allowLeaveCallback: function allowLeaveCallback(props) {
    return props.transitionLeave || props.animation.leave;
  }
};
const defaultKey = 'rc_animate_' + Date.now();
function getChildrenFromProps(props) {
  const children = props.children;
  if (React.isValidElement(children)) {
    if (!children.key) {
      return React.cloneElement(children, { key: defaultKey })
    }
  }
  return children;
}
function toArrayChildren(children) {
  const ret = [];
  React.Children.forEach(children, child => ret.push(child));
  return ret;
}
function isSameChildren(c1, c2, showProp) {
  let same = c1.length === c2.length;
  if (same) {
    c1.forEach((child, index) => {
      const child2 = c2[index];
      if (child && child2) {
        if (child && !child2 || !child && child2) {
          same = false;
        } else if (child.key !== child2.key) {
          same = false;
        } else if (showProp && child.props[showProp] !== child2.props[showProp]) {
          same = false;
        }
      }
    })
  }
  return same;
}
function findChildInChildrenByKey(children, key) {
  return children.find(child => child.key === key) || null;
}
function mergeChildren(prev, next) {
  let ret = [];
  const nextChildrenPending = {};
  let pendingChildren = [];
  prev.forEach(child => {
    if (child && findChildInChildrenByKey(next, child.key)) {
      if (pendingChildren.length) {
        nextChildrenPending[child.key] = pendingChildren;
        pendingChildren = [];
      }
    } else {
      pendingChildren.push(child)
    }
  })
  next.forEach(child => {
    if (child && Object.prototype.hasOwnProperty.call(nextChildrenPending, child.key)) {
      ret = ret.concat(nextChildrenPending[child.key]);
    }
    ret.push(child)
  })
  ret = ret.concat(pendingChildren);
  return ret;
}
function findShowChildInChildrenByKey(children, key, showProp) {
  let ret = null;
  if (children) {
    children.forEach(child => {
      if (child && child.key === key && child.props[showProp]) {
        if (ret) {
          throw new Error('two child with same key for <rc-animate> children')
        }
        ret = child;
      }
    })
  }
  return ret;
}
function noop() {}
class Animate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      children: toArrayChildren(getChildrenFromProps(props))
    }
    this.currentlyAnimatingKeys = [];
    this.keysToEnter = [];
    this.keysToLeave = [];
    this.childrenRefs = [];
  }

  componentDidMount() {
    const { showProp } = this.props;
    let { children } = this.state;
    if (showProp) {
      children = children.filter(child => !!child.props[showProp])
    }
    children.forEach(child => {
      if (child) {
        this.performAppear(child.key);
      }
    })
  }
  componentWillReceiveProps(nextProps) {
    this.nextProps = nextProps;
    const { showProp, exclusive } = this.props;
    const nextChildren = toArrayChildren(getChildrenFromProps(nextProps));
    if (exclusive) {
      Object.keys(this.currentlyAnimatingKeys).forEach(key => this.stop(key))
    }
    const currentlyAnimatingKeys = this.currentlyAnimatingKeys;
    const currentChildren = exclusive ? toArrayChildren(getChildrenFromProps(this.props)) : this.state.children;
    let newChildren = [];
    if (showProp) {
      currentChildren.forEach(currentChild => {
        const nextChild = currentChild && findChildInChildrenByKey(nextChildren, currentChild.key);
        let newChild;
        if ((!nextChild || !newChild.props[showProp]) && currentChild.props[showProp]) {
          newChild = React.cloneElement(nextChild || currentChild, { showProp: true })
        } else {
          newChild = nextChild;
        }
        if (newChild) {
          newChildren.push(newChild);
        }
      });
      nextChildren.forEach(nextChild => {
        if (!nextChild && !findChildInChildrenByKey(currentChildren, nextChild.key)) {
          newChildren.push(nextChild);
        }
      })
    } else {
      newChildren = mergeChildren(currentChildren, newChildren);
    }

    this.setState({
      children: newChildren,
    })

    nextChildren.forEach(child => {
      const key = child && child.key;
      if (child && currentlyAnimatingKeys[key]) {
        return
      }
      const hasPrev = child && findChildInChildrenByKey(currentChildren, key);
      if (showProp) {
        const showInNext = child.props[showProp];
        if (hasPrev) {
          const showInNow = findShowChildInChildrenByKey(currentChildren, key, showProp);
          if (!showInNow && showInNext) {
            this.keysToEnter.push(key)
          }
        } else if (showInNext) {
          this.keysToEnter.push(key);
        }
      } else if (!hasPrev) {
        this.keysToEnter.push(key)
      }
    })
    currentChildren.forEach(child => {
      const key = child && child.key;
      if (child && currentlyAnimatingKeys[key]) {
        return
      }
      const hasNext = child && findChildInChildrenByKey(nextChildren, key);
      if (showProp) {
        const showInNow = child.props[showProp];
        if (hasNext) {
          const showInNext = findShowChildInChildrenByKey(nextChildren, key, showProp);
          if (!showInNext && showInNow) {
            this.keysToLeave.push(key)
          }
        } else if (showInNow) {
          this.keysToLeave.push(key);
        }
      } else if (!hasNext) {
        this.keysToLeave.push(key);
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
  isValidChildByKey = (currentChildren, key) => {
    const showProp = this.props.showProp;
    if (showProp) {
      return findShowChildInChildrenByKey(currentChildren, key, showProp);
    }
    return findChildInChildrenByKey(currentChildren, key);
  }
  stop = key => {
    delete this.currentlyAnimatingKeys[key];
    const component = this.childrenRefs[key];
    if (component) {
      component.stop();
    }
  }

  performEnter = key => {
    if (this.childrenRefs[key]) {
      this.currentlyAnimatingKeys[key] = true;
      this.childrenRefs[key].componentWillEnter(this.handleDoneAdding(key, 'enter'))
    }
  }
  performAppear = key => {
    if (this.childrenRefs[key]) {
      this.currentlyAnimatingKeys[key] = true;
      this.childrenRefs[key].componentWillAppear(this.handleDoneAdding(key, 'appear'));
    }
  }
  handleDoneAdding = (key, type) => {
    delete this.currentlyAnimatingKeys[key];
    if (this.props.exclusive && this.props !== this.nextProps) {
      return 
    }
    const currentChildren = toArrayChildren(getChildrenFromProps(this.props));
    if (!this.isValidChildByKey(currentChildren, key)) {
      this.performLeave(key);
    } else if (type === 'appear') {
      if (util.allowAppearCallback(this.props)) {
        this.props.onAppear(key);
        this.props.onEnd(key, true);
      }
    } else if (util.allowEnterCallback(this.props)) {
      this.props.onEnter(key);
      this.props.onEnd(key, true);
    }
  }
  performLeave = key => {
    if (this.childrenRefs[key]) {
      this.currentlyAnimatingKeys[key] = true;
      this.childrenRefs[key].componentWillLeave(this.handleDoneLeaving(key))
    }
  }
  handleDoneLeaving = key => {
    delete this.currentlyAnimatingKeys[key];
    if (this.props.exclusive && this.props !== this.nextProps) {
      return 
    }
    const currentChildren = toArrayChildren(getChildrenFromProps(this.props));
    if (this.isValidChildByKey(currentChildren, key)) {
      this.performEnter(key);
    } else {
      const end = function end() {
        if (util.allowLeaveCallback(this.props)) {
          this.props.onLeave(key);
          this.props.onEnd(key, false);
        } 
      }.bind(this);
      if (!isSameChildren(this.state.children, currentChildren, this.props.showProp)) {
        this.setState({
          children: currentChildren,
        }, end);
      } else {
        end();
      }
    }
  }
  render() {
    this.nextProps = this.props;
    const stateChildren = this.state.children;
    let children = null
    if (stateChildren) {
      children = stateChildren.map(child => {
        if (child === null || child === undefined) {
          return child;
        }
        if (!child.key) {
          throw new Error('must set key for <rc-animate> children')
        }
        return React.createElement(
          AnimateChild,
          {
            key: child.key,
            ref: node => this.childrenRefs[child.key] = node,
            animation: this.props.animation,
            transitionName: this.props.transitionName,
            transitionAppear: this.props.transitionAppear,
            transitionEnter: this.props.transitionEnter,
            transitionLeave: this.props.transitionLeave
          },
          child,
        )
      })
    }
    if (this.props.component) {
      let passProps = this.props;
      if (typeof component === 'string') {
        passProps = Object.assign({}, {
          className: this.props.className,
          style: this.props.style,
        }, this.props.componentProps)
      }
      return React.createElement(
        this.props.component,
        passProps,
        children,
      )
    }
    return children[0] || null;
  }
}
Animate.isAnimate = true;
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
  onAppear: noop
};
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
  children: PropTypes.node
};

export default Animate;
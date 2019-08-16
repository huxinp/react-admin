import React from 'react';
import PropTypes, { func } from 'prop-types';
import ReactDOM from 'react-dom';
import cssAnimate, { isCssAnimationSupported } from 'css-animation';

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

var transitionMap = {
  enter: 'transitionEnter',
  appear: 'transitionAppear',
  leave: 'transitionLeave'
};

class AnimateChild extends React.Component {
  componentWillUnmount() {
    this.stop();
  }
  componentWillEnter(done) {
    if (util.isEnterSupported(this.props)) {
      this.transition('enter', done);
    } else {
      done();
    }
  }
  componentWillAppear(done) {
    if (util.isAppearSupported(this.props)) {
      this.transition('appear', done);
    } else {
      done();
    }
  }
  componentWillLeave(done) {
    if (util.isLeaveSupported(this.props)) {
      this.transition('leave', done)
    } else {
      done();
    }
  }
  transition = (animationType, finishCallback) => {
    const node = ReactDOM.findDOMNode(this);
    const { transitionName } = this.props;
    const nameIsObj = typeof transitionName === 'object';
    this.stop();
    const end = function end() {
      this.stopper = null;
      finishCallback();
    }.bind(this);
    if ((isCssAnimationSupported || !this.props.animation[animationType]) && transitionName && this.props[transitionMap[animationType]]) {
      const name = nameIsObj ? transitionName[animationType] : transitionName + '-' + animationType;
      let activeName = name + '-active';
      if (nameIsObj && transitionName[animationType + 'Active']) {
        activeName = transitionName[animationType + 'Active']
      }
      this.stopper = cssAnimate(node, {
        name,
        active: activeName,
      }, end);
    } else {
      this.stopper = this.props.animation[animationType](node, end);
    }
  }
  stop = () => {
    const stopper = this.stopper;
    if (stopper) {
      this.stopper = null;
      stopper.stop();
    }
  }
  render() {
    return this.props.children
  }
}
AnimateChild.propTypes = {
  children: PropTypes.any,
  animation: PropTypes.any,
  transitionName: PropTypes.any
};

export default AnimateChild;
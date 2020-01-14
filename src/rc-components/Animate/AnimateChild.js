import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import cssAnimate, { isCssAnimationSupported } from 'css-animation';
import animUtil from './util/animate';

const transitionMap = {
  enter: 'transitionEnter',
  appear: 'transitionAppear',
  leave: 'transitionLeave',
};

export default class AnimateChild extends React.Component {
  constructor(props) {
    super(props);
    this.componentWillAppear = this.componentWillAppear.bind(this);
    this.componentWillEnter = this.componentWillEnter.bind(this);
    this.componentWillLeave = this.componentWillLeave.bind(this);
    this.transition = this.transition.bind(this);
    this.stop = this.stop.bind(this);
  }
  componentWillUnmount() {
    this.stop();
  }
  componentWillEnter(done) {
    if (animUtil.isEnterSupported(this.props)) {
      this.transition('enter', done);
    } else {
      done();
    }
  }
  componentWillAppear(done) {
    if (animUtil.isAppearSupported(this.props)) {
      this.transition('appear', done);
    } else {
      done();
    }
  }
  componentWillLeave(done) {
    if (animUtil.isLeaveSupported(this.props)) {
      this.transition('leave', done);
    } else {
      done();
    }
  }
  transition(animationType, finishCallback) {
    const node = ReactDOM.findDOMNode(this);
    const { transitionName, animation } = this.props;
    const nameIsObj = typeof transitionName === 'object';
    this.stop();
    const end = function end() {
      this.stopper = null;
      finishCallback();
    }.bind(this);
    if (
      (isCssAnimationSupported || !animation[animationType])
      && transitionName
      && this.props[transitionMap[animationType]]
    ) {
      const name = nameIsObj ? transitionName[animationType] : transitionName + '-' + animationType;
      let activeName = name + '-active';
      if (nameIsObj && transitionName[animationType + 'Active']) {
        activeName = transitionName[animationType + 'Active'];
      }
      this.stopper = cssAnimate(node, {
        name: name,
        active: activeName,
      }, end);
    } else {
      this.stopper = animation[animationType](node, end);
    }
  }
  stop() {
    const stopper = this.stopper;
    if (stopper) {
      this.stopper = null;
      stopper.stop();
    }
  }
  render() {
    return this.props.children;
  }
}

AnimateChild.propTypes = {
  children: PropTypes.any,
  animation: PropTypes.any,
  transitionName: PropTypes.any,
}

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Animate from '../Animate/Animate';
import classnames from 'classnames';
import Notice from './Notice';

let seed = 0;
let now = Date.now();

function getUuid() {
  return 'rcNocification_' + now + '_' + seed ++;
}

function createChainedFunction() {
  const args = [].slice.call(arguments, 0);
  if (args.length === 1) {
    return args[0];
  }
  return function chainedFunction() {
    for(let i = 0; i < args.length; i ++) {
      if (args[i] && args[i].apply) {
        args[i].apply(this, arguments);
      }
    }
  }
}

export default class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.add = this.add.bind(this);
    this.remove = this.remove.bind(this);
    this.getTransitionName = this.getTransitionName.bind(this);
    this.state = {
      notices: [],
    }
  }

  add(notice) {
    const key = notice.key = notice.key || getUuid();
    this.setState(function(previousState) {
      const notices = previousState.notices;
      if (!notices.filter(v => v.key === key).length) {
        return {
          notices: notices.concat(notice),
        }
      }
    })
  }
  remove(key) {
    this.setState(function(previousState) {
      return {
        notices: previousState.notices.filter(notice => notice.key !== key),
      }
    })
  }
  getTransitionName() {
    let { transitionName, animation, prefixCls } = this.props;
    if (!transitionName && animation) {
      transitionName = prefixCls + '-' + animation;
    }
    return transitionName;
  }
  render() {
    const { prefixCls, className, style } = this.props;
    const _this = this;
    const noticeNodes = this.state.notices.map(function(notice) {
      const onClose = createChainedFunction(_this.remove.bind(_this, notice.key), notice.onClose);
      return React.createElement(
        Notice,
        {...notice, prefixCls, onClose},
        notice.content,
      );
    });
    const _className = classnames(className, prefixCls)
    return React.createElement(
      'div',
      { className: _className, style },
      React.createElement(
        Animate,
        { transitionName: this.getTransitionName() },
        noticeNodes
      )
    )
  }
}

Notification.propTypes = {
  prefixCls: PropTypes.string,
  transitionName: PropTypes.string,
  animation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  style: PropTypes.object,
};
Notification.defaultProps = {
  prefixCls: 'rc-notification',
  animation: 'fade',
  style: {
    top: 65,
    left: '50%',
  },
};

Notification.newInstance = function newNotificationInstance(properties) {
  const _ref = properties || {};
  const { getContainer, ...props } = _ref;
  let div = void 0;
  if (getContainer) {
    div = getContainer();
  } else {
    div = document.createElement('div');
    document.body.appendChild(div);
  }
  const notification = ReactDOM.render(React.createElement(Notification, props), div);
  return {
    notice: function notice(noticeProps) {
      notification.add(noticeProps);
    },
    removeNotice: function removeNotice(key) {
      notification.remove(key);
    },
    component: notification,
    destroy: function destroyed() {
      ReactDOM.unmountComponentAtNode(div);
      if (!getContainer) {
        document.body.removeChild(div);
      }
    },
  }
}
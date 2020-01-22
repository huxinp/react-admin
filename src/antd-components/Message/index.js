import React from 'react';
import Notification from '@/rc-components/Notification';
import './index.less';

let defaultDuration = 3;
let defaultTop = void 0;
let messageInstance = void 0;
let key = 1;
let prefixCls = 'antd-message';
let getContainer = void 0;

function getMessageInstance() {
  messageInstance = messageInstance || Notification.newInstance({
    prefixCls: prefixCls,
    transitionName: 'move-up',
    style: { top: defaultTop },
    getContainer: getContainer,
  })
  return messageInstance;
}
function notice(content) {
  const duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultDuration;
  const type = arguments[2];
  const onClose = arguments[3];
  const iconType = {
    info: 'info-circle',
    success: 'check-circle',
    error: 'cross-circle',
    warning: 'exclamation-circle',
    loading: 'loading',
  }[type];
  const instance = getMessageInstance();
  instance.notice({
    key,
    duration,
    style: {},
    content: React.createElement(
      'div',
      { className: prefixCls + '-custom-content ' + prefixCls + '-' + type },
      // React.createElement(Icon, { type: iconType }),
      React.createElement('span', null, content)
    ),
    onClose,
  })
  return function() {
    let target = key++;
    return function() {
      instance.removeNotice(target);
    }
  }()
}

export default {
  info: function info(content, duration, onClose) {
    return notice(content, duration, 'info', onClose);
  },
  success: function success(content, duration, onClose) {
    return notice(content, duration, 'success', onClose);
  },
  error: function error(content, duration, onClose) {
    return notice(content, duration, 'err', onClose);
  },
  warn: function warn(content, duration, onClose) {
    return notice(content, duration, 'warning', onClose);
  },
  warning: function warning(content, duration, onClose) {
    return notice(content, duration, 'warning', onClose);
  },
  loading: function loading(content, duration, onClose) {
    return notice(content, duration, 'loading', onClose);
  },
  config: function config(options) {
    if (options.top !== undefined) {
      defaultTop = options.top;
      messageInstance = null; // delete messageInstance for new defaultTop
    }
    if (options.duration !== undefined) {
      defaultDuration = options.duration;
    }
    if (options.prefixCls !== undefined) {
      prefixCls = options.prefixCls;
    }
    if (options.getContainer !== undefined) {
      getContainer = options.getContainer;
    }
  },
  destroy: function destroy() {
    if (messageInstance) {
      messageInstance.destroy();
      messageInstance = null;
    }
  }
};

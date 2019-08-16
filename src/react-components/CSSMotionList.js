import React from 'react';
import PropTypes from 'prop-types';

import { polyfill } from 'react-lifecycles-compat';
import OriginCSSMotion, { supportTransition } from './CSSMotion';
import { MonthPicker } from 'ant-design-vue/types/date-picker/month-picker';

const STATUS_ADD = 'add';
const STATUS_KEEP = 'keep';
const STATUS_REMOVE = 'remove';
const STATUS_REMOVED = 'removed';
const MotionPropTypes = {
  eventProps: PropTypes.object, // Internal usage. Only pass by CSSMotionList
  visible: PropTypes.bool,
  children: PropTypes.func,
  motionName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  motionAppear: PropTypes.bool,
  motionEnter: PropTypes.bool,
  motionLeave: PropTypes.bool,
  motionLeaveImmediately: PropTypes.bool, // Trigger leave motion immediately
  removeOnLeave: PropTypes.bool,
  leavedClassName: PropTypes.string,
  onAppearStart: PropTypes.func,
  onAppearActive: PropTypes.func,
  onAppearEnd: PropTypes.func,
  onEnterStart: PropTypes.func,
  onEnterActive: PropTypes.func,
  onEnterEnd: PropTypes.func,
  onLeaveStart: PropTypes.func,
  onLeaveActive: PropTypes.func,
  onLeaveEnd: PropTypes.func
};
function wrapKeyToObject(key) {
  let keyObj;
  if (key && typeof key === 'object' && 'key' in key) {
    keyObj = key
  } else {
    keyObj = { key }
  }
  return Object.assign({}, keyObj, {
    key: String(keyObj.key)
  })
}
function parseKeys() {
  const keys = arguments[0] || [];
  return keys.map(wrapKeyToObject);
}
function diffKeys() {
  const prevKeys = arguments[0] || [];
  const currentKeys = arguments[1] || [];
  let list = [];
  let currentIndex = 0;
  const currentLen = currentKeys.length;
  const prevKeysObjects = parseKeys(prevKeys);
  const currentKeyObjects = parseKeys(currentKeys);

  prevKeysObjects.forEach(keyObj => {
    let hit = false;
    for(let i = currentIndex; i < currentLen; i++) {
      const currentKeyObj = currentKeyObjects[i];
      if (currentKeyObj.key === keyObj.key) {
        if (currentIndex < i) {
          list = list.concat(currentKeyObjects.slice(currentIndex, i).map(obj => {
            return {...obj, status: STATUS_ADD }
          }));
          currentIndex = i;
        }
        list.push({
          ...currentKeyObj,
          status: STATUS_KEEP
        })
        currentIndex += 1;
        hit = true;
        break;
      }
    }
    if (!hit) {
      list.push({
        ...keyObj,
        status: STATUS_REMOVE
      })
    }
  })
  if (currentIndex < currentLen) {
    list = list.concat(currentKeyObjects.slice(currentIndex).map(obj => Object.assign({}, obj, { status: STATUS_ADD })));
  }
  const keys = {};
  list.forEach(item => {
    const key = item.key;
    keys[key] = (keys[key] || 0) + 1;
  })
  const duplicatedKeys = Object.keys(key).filter(key => keys[key] > 1);
  duplicatedKeys.forEach(matchKey => {
    list = list.filter(item => {
      const { key, status } = item;
      return key !== matchKey || status !== STATUS_REMOVE;
    });
    list.forEach(node => {
      if (node.key === matchKey) {
        node.status = STATUS_KEEP;
      }
    });
  });
  return list;
}

function genCSSMotionList(transitionSupport) {
  const CSSMotion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : OriginCSSMotion;

  class CSSMotionList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        keyEntities: [],
      }
    }
    removeKey = key => {
      this.setState(ref => {
        const keyEntities = ref.keyEntities;
        return {
          keyEntities: keyEntities.map(entity => {
            if (entity.key !== key) return entity;
            return {
              ...entity,
              status: STATUS_REMOVED,
            }
          })
        }
      })
    }
    getDerivedStateFromProps(nextProps, prevState) {
      const keys = nextProps.keys;
      const keyEntities = prevState.keyEntities;
      const parsedKeyObjects = parseKeys(keys);
      if (!transitionSupport) {
        return {
          keyEntities: parsedKeyObjects.map(obj => Object.assign({}, obj, { status: STATUS_KEEP }))
        }
      }
      const mixedKeyEntities = diffKeys(keyEntities, parsedKeyObjects);
      const keyEntitiesLen = keyEntities.length;
      return {
        keyEntities: mixedKeyEntities.filter(entity => {
          let prevEntity = null;
          for (let i = 0; i < keyEntitiesLen; i++) {
            const currentEntity = keyEntities[i];
            if (currentEntity.key === entity.key) {
              prevEntity = currentEntity;
              break;
            }
          }
          if (prevEntity && prevEntity.status === STATUS_REMOVED && entity.status === STATUS_REMOVE) {
            return false;
          }
          return true;
        })
      }
    }
    render() {
      const { keyEntities } = this.state;
      const { component, children, ...restProps } = this.props;
      const motionProps = {};
      Object.keys(MotionPropTypes).forEach(prop => {
        motionProps[prop] = restProps[prop];
        delete restProps[prop];
      })
      delete restProps.keys;
      return React.createElement(
        component,
        restProps,
        keyEntities.map(entity => {
          const { status, ...eventProps } = entity;
          const visible = status === STATUS_ADD || status === STATUS_KEEP;
          return React.createElement(
            CSSMotion,
            {
              ...motionProps,
              key: eventProps.key,
              visible,
              eventProps,
              onLeaveEnd: () => {
                if (motionProps.onLeaveEnd) {
                  motionProps.onLeaveEnd.apply(motionProps, arguments);
                }
                this.removeKey(eventProps.key);
              }
            },
            children,
          )
        })
      )
    }
  }
  CSSMotionList.propTypes = {
    eventProps: PropTypes.object, // Internal usage. Only pass by CSSMotionList
    visible: PropTypes.bool,
    children: PropTypes.func,
    motionName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    motionAppear: PropTypes.bool,
    motionEnter: PropTypes.bool,
    motionLeave: PropTypes.bool,
    motionLeaveImmediately: PropTypes.bool, // Trigger leave motion immediately
    removeOnLeave: PropTypes.bool,
    leavedClassName: PropTypes.string,
    onAppearStart: PropTypes.func,
    onAppearActive: PropTypes.func,
    onAppearEnd: PropTypes.func,
    onEnterStart: PropTypes.func,
    onEnterActive: PropTypes.func,
    onEnterEnd: PropTypes.func,
    onLeaveStart: PropTypes.func,
    onLeaveActive: PropTypes.func,
    onLeaveEnd: PropTypes.func,
    internalRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    component: PropTypes.string,
    keys: PropTypes.array
  };
  CSSMotionList.defaultProps = {
    component: 'div'
  };
  
  polyfill(CSSMotionList);

  return CSSMotionList;
}
export default genCSSMotionList(supportTransition);
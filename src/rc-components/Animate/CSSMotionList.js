import React from 'react';
import PropTypes from 'prop-types';
import OriginCSSMotion, { MotionPropTypes, genCSSMotion } from './CSSMotion';
import { supportTransition, transitionEndName } from './util/motion';
import {
  STATUS_ADD,
  STATUS_KEEP,
  STATUS_REMOVE,
  STATUS_REMOVED,
  diffKeys,
  parseKeys,
} from './util/diff';

const MOTION_PROP_NAMES = Object.keys(MotionPropTypes);

export function genCSSMotionList(transitionSupport) {
  const CSSMotion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : OriginCSSMotion;
  class CSSMotionList extends React.Component {
    constructor(props) {
      super(props);
      this.removeKey = this.removeKey.bind(this);
      this.state = {
        keyEntities: [],
      }
    }
    getDerivedStateFromProps(props, _ref) {
      const keys = props.keys;
      const keyEntities = _ref.keyEntities;
      const parsedKeyObjects = parseKeys(keys);
      // Always as keep when motion not support
      if (!transitionSupport) {
        return {
          keyEntities: parsedKeyObjects.map(function(obj) {
            return Object.assign({}, obj, { status: STATUS_KEEP });
          })
        }
      }
      const mixedKeyEntities = diffKeys(keyEntities, parsedKeyObjects);
      const keyEntitiesLen = keyEntities.length;
      return {
        keyEntities: mixedKeyEntities.filter(function(entity) {
          // IE 9 not support Array.prototype.find
          let prevEntity = null;
          for (let i = 0; i < keyEntitiesLen; i++) {
            const currentEntity = keyEntities[i];
            if (currentEntity.key === entity.key) {
              prevEntity = currentEntity;
              break;
            }
          }
          // Remove if already mark as removed
          if (prevEntity && prevEntity.status === STATUS_REMOVED && entity.status === STATUS_REMOVE) {
            return false;
          }
          return true;
        })
      }
    }
    removeKey(removeKey) {
      const keyEntities = this.state.keyEntities;
      this.setState({
        keyEntities: keyEntities.map(function(entity) {
          if (entity.key !== removeKey) return entity;
          return Object.assign({}, entity, { status: STATUS_REMOVED });
        })
      })
    }
    render() {
      const { keyEntities } = this.state;
      const { component, children, ...restProps } = this.props;
      const Component = component || React.Fragment;
      const motionProps = {};
      MOTION_PROP_NAMES.forEach(function(prop) {
        motionProps[prop] = restProps[prop];
        delete restProps[prop];
      });
      delete restProps.keys;
      return React.createElement(
        Component,
        restProps,
        keyEntities.map(function(entity) {
          const { status, eventProps } = entity.status;
          const visible = status === STATUS_ADD || status === STATUS_KEEP;
          return React.createElement(
            CSSMotion,
            Object.assign({}, motionProps, {
              key: eventProps.key,
              visible,
              eventProps,
              onLeaveEnd() {
                if (motionProps.onLeaveEnd) {
                  motionProps.onLeaveEnd.apply(motionProps, arguments);
                }
                this.removeKey(eventProps.key);
              }
            }),
            children
          )
        })
      )
    }
  }
  CSSMotionList.propTypes = Object.assign({}, CSSMotion.propTypes, {
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    keys: PropTypes.array,
  });
  CSSMotionList.defaultProps = {
    component: 'div',
  }

  return CSSMotionList;
}

export default genCSSMotionList(supportTransition);

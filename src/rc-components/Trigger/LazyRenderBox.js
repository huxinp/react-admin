import React from 'react';
import PropTypes from 'prop-types';

export default class LazyRenderBox extends React.Component {

  shouldComponentUpdate(nextProps) {
    return nextProps.hiddenClassName || nextProps.visible;
  }
  render() {
    const { hiddenClassName, visible, ...props } = this.props;
    if (hiddenClassName || React.Children.count(props.children) > 1) {
      if (!visible && hiddenClassName) {
        props.className += ' ' + hiddenClassName;
      }
      return React.createElement('div', props);
    }
    return React.Children.only(props.children);
  }
}

LazyRenderBox.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  visible: PropTypes.bool,
  hiddenClassName: PropTypes.string,
}
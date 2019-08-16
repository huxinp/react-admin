import React from 'react';
import PropTypes from 'prop-types';

class LazyRenderBox extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.hiddenClassName || nextProps.visible;
  }
  render() {
    const { hiddenClassName, visible, ...otherProps } = this.props;
    if (hiddenClassName || React.Children.count(otherProps.children) > 1) {
      if (!visible && hiddenClassName) {
        otherProps.className += ' ' + hiddenClassName;
      }
      return React.createElement('div', otherProps);
    }
    return React.Children.only(otherProps.children);
  }
}

LazyRenderBox.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  visible: PropTypes.bool,
  hiddenClassName: PropTypes.string,
}

export default LazyRenderBox;
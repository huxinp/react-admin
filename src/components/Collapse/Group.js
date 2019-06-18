import React from 'react';
import PropTypes from 'prop-types';

export default class Collapse extends React.PureComponent {
  render () {
    const { children, className } = this.props;
    return (
      <div className={`collapse-group ${className || ''}`}>
        { React.Children.map(children, child => child) }
      </div>
    )
  }
}
Collapse.propTypes = {
  className: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.element),
}
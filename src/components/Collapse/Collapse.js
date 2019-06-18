import React from 'react';
import PropTypes from 'prop-types';

export default class Collapse extends React.PureComponent {
  render () {
    const { panel, content, open, className } = this.props;
    return (
      <div className={`collapse ${open ? 'unfold' : ''} ${className || ''}`}>
        <div className="collapse-panel">
          {panel}
        </div>
        <div className="collapse-content">
          {content}
        </div>
      </div>
    )
  }
}
Collapse.defaultProps = {
  open: false,
}
Collapse.propTypes = {
  className: PropTypes.string,
  panel: PropTypes.element.isRequired,
  content: PropTypes.element.isRequired,
  open: PropTypes.bool,
}

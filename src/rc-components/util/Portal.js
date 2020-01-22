import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class Portal extends React.Component {
  componentDidMount() {
    this.createContainer();
  }
  componentDidUpdate(prevProps) {
    this.props.didUpdate && this.props.didUpdate(prevProps);
  }
  componentWillUnmount() {
    this.removeContainer();
  }
  createContainer() {
    this.container = this.props.getContainer();
    this.forceUpdate();
  }
  removeContainer() {
    if (this.container) {
      this.container.parentNode.removeChild(this.container);
    }
  }
  render () {
    if (this.container) {
      return ReactDOM.createPortal(this.props.children, this.container);
    }
    return null
  }
}

Portal.propTypes = {
  getContainer: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  didUpdate: PropTypes.func,
}
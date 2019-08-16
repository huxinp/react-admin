import React from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';

class Protal extends React.Component {

  componentDidMount() {
    this.createContainer();
  }
  componentDidUpdate(prevProps) {
    var didUpdate = this.props.didUpdate;
    if (didUpdate) {
      didUpdate(prevProps)
    }
  }
  componentWillUnmount() {
    this.removeContainer();
  }
  createContainer = () => {
    this._container = this.props.getContianer();
    this.forceUpdate();
  }
  removeContainer = () => {
    if (this._container) {
      this._container.parentNode.removeChild(this._container)
    }
  }

  render() {
    return this._container ? ReactDom.unstable_renderSubtreeIntoContainer(this, this.props.children, this._container) : null;
  }
}
PropTypes.defaultProps = {

}
Protal.propTypes = {
  getContainer: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  didUpdate: PropTypes.func
}

export default Protal;
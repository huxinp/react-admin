import React from 'react';
import PropTypes from 'prop-types';
import ReactDom from 'react-dom';

class ContainerRender extends React.Component {

  componentDidMount() {
    if (this.props.autoMount) {
      this.renderComponent();
    }
  }
  componentDidUpdate() {
    if (this.props.autoMount) {
      this.renderComponent();
    }
  }
  componentWillUnmount() {
    if(this.props.autoDestroy) {
      this.removeContainer()
    }
  }
  renderComponent = (props, ready) => {
    const { visible, getComponent, forceRender, getContainer, parent } = this.props;
    if (visible || parent._component || forceRender) {
      if (!this._container) {
        this._container = getContainer();
      }
      ReactDom.unstable_renderSubtreeIntoContainer(
        parent,
        getComponent(props),
        this._container,
        function callback() {
          if (ready) {
            ready.call(this);
          }
        }
      )
    }
  }
  removeContainer = () => {
    if (this._container) {
      ReactDom.unmountComponentAtNode(this._container);
      this._container.parentNode.removeChild(this._container);
      this._container = null;
    }
  }

  render() {
    return this.props.children({
      renderComponent: this.renderComponent,
      removeContainer: this.removeContainer,
    })
  }
}
ContainerRender.defaultProps = {
  autoMount: true,
  autoDestroy: true,
  forceRender: false
}
ContainerRender.propTypes = {
  autoMount: PropTypes.bool,
  autoDestroy: PropTypes.bool,
  visible: PropTypes.bool,
  forceRender: PropTypes.bool,
  parent: PropTypes.any,
  getComponent: PropTypes.func.isRequired,
  getContainer: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired
}

export default ContainerRender;

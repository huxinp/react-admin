import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

class ReactComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="react-components-page">
        React Component Page
      </div>
    )
  }
}

ReactComponent.defaultProps = {

}
ReactComponent.propTypes = {

}

export default ReactComponent;
import React, { PropTypes } from 'react';

import './index.less';

export default class Vchat extends React.PureComponent {

  render() {
    return (
      <div className="vchat-container">
        { React.Children.toArray(this.props.children) }
      </div>
    )
  }
}
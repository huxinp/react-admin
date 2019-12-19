import React, { PropTypes } from 'react';

import './index.less';

export default class Rxjs extends React.PureComponent {

  render() {
    return (
      <div className="rxjs-container">
        { React.Children.toArray(this.props.children) }
      </div>
    )
  }
}
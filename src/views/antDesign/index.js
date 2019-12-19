import React, { PropTypes } from 'react';

import './index.less';

export default class AntDesign extends React.PureComponent {

  render() {
    return (
      <div className="antd-container">
        { React.Children.toArray(this.props.children) }
      </div>
    )
  }
}
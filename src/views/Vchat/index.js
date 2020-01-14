import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import VchatRoutes from './routes';

import './index.less';

export default class Vchat extends React.PureComponent {

  render() {
    const { childRoutes } = VchatRoutes('/Vchat')[0];
    return (
      <div className="vchat-container">
        <div className="sub-nav-bar">
          { childRoutes.map(item => <Link to={item.path} key={item.name}>{item.name}</Link>) }
        </div>
        { React.Children.toArray(this.props.children) }
      </div>
    )
  }
}
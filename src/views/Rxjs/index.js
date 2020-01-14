import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import RxjsRoutes from './routes';

import './index.less';

export default class Rxjs extends React.PureComponent {

  render() {
    const childRoutes = RxjsRoutes('/Rxjs')[0].childRoutes;
    return (
      <div className="rxjs-container">
        <div className="sub-nav-bar">
          { childRoutes.map(item => <Link key={item.name} to={item.path}>{item.name}</Link>) }
        </div>
        { React.Children.toArray(this.props.children) }
      </div>
    )
  }
}
import React, { PropTypes } from 'react';
import { Link, browserHistory  } from 'react-router';

import createRoutes from '../../routes';

import './index.less';

export default class SideBar extends React.PureComponent {
  state = {
    pathname: '/',
  }
  componentDidMount () {
    this.setState({
      pathname: window.location.pathname,
    });
    browserHistory.listen(this.onRouteChange)
  }
  onRouteChange = e => {
    this.setState({
      pathname: e.pathname,
    })
  }
  render() {
    const routes = createRoutes();
    const sideList = routes.slice(0, routes.length - 1);
    sideList.unshift(sideList.pop());
    return (
      <div className="side-bar">
        {
          sideList.map(item => {
            const active = item.path === this.state.pathname;
            console.log(item.path)
            return (
              <div className={`side-bar-item${active ? ' actived' : ''}`} key={item.path}>
                <Link to={item.path}>{item.name}</Link>
              </div>
            )
          })
        }
      </div>
    )
  }
}

SideBar.defaultProps = {

}
SideBar.propTypes = {

}
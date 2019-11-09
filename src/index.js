import React from 'react';
import ReactDOM from 'react-dom';
import { applyRouterMiddleware, Router, browserHistory } from 'react-router';
import { useScroll } from 'react-router-scroll';
import createRoutes from './routes';
import Home from './pages/home';
import App from './App';
import './index.css';
import * as serviceWorker from './serviceWorker';

const rootRoute = {
  component: App,
  indexRoute: { component: Home },
  childRoutes: createRoutes(),
}

ReactDOM.render(
  <Router history={browserHistory} routes={rootRoute} render={applyRouterMiddleware(useScroll())} />,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

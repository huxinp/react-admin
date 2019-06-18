import React from 'react';
import { Router, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import createRoutes from './route';
import './App.css';

const history = createBrowserHistory()

function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={props => <route.component {...props} routes={route.routes} />}
    />
  );
}

const routes = createRoutes();

function App() {
  return (
    <Router
      history={history}
    >
      {
        routes.map((route, i) => {
          // console.log('route', route);
          return <RouteWithSubRoutes key={i} {...route} />
        })
      }
    </Router>
  );
}

export default App;

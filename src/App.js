import React from 'react';

import SideBar from './containers/SideBar';

import './App.less';

function App({ children }) {
  return (
    <div className="app-wrapper">
      <div className="app-header">App Header</div>
      <div className="app-body">
        <div className="app-side"><SideBar /></div>
        <div className="app-content">
          { React.Children.toArray(children) }
        </div>
      </div>
    </div>
  );
}

export default App;

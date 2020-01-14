import React, { PropTypes } from 'react';
import { Link  } from 'react-router';
import {
  rc_Map,
} from './utils';
import './index.less';

export default class AntDesign extends React.PureComponent {
  
  state = {
    rcName: 'rc-calendar',
  }

  componentDidMount() {
    
  }

  clickHandle = (rcName) => {
    this.setState({
      rcName,
    })
  }

  render() {
    const { rcName } = this.state;
    const RcComponent = rc_Map[rcName];
    return (
      <div className="antd-container">
        <div className="antd-component">
          <RcComponent />
        </div>
        <div className="catalog-list">
          { Object.keys(rc_Map).map(item => <span key={item} onClick={() => this.clickHandle(item)}>{item}</span>) }
        </div>
      </div>
    )
  }
}
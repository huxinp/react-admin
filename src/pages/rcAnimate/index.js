import React from 'react';
import PropTypes from 'prop-types';
import Animate from 'rc-animate';
import './index.scss';
import { Checkbox } from '../../components/Checkbox'

const Div = (props) => {
  const { style, show, ...restProps } = props;
  const newStyle = { ...style, display: show ? '' : 'none' };
  return <div {...restProps} style={newStyle}/>;
};

Div.propTypes = {
  style: PropTypes.object,
  show: PropTypes.bool,
};

export default class RcAnimate extends React.PureComponent {
  state = {
    enter: false
  }
  componentDidMount() {

  }
  toggle = (field) => {
    this.setState({ [field]: !this.state[field] })
  }
  render() {
    const style = {
      width: '200px',
      height: '200px',
      backgroundColor: 'red',
    };
    const { enter, exclusive } = this.state;
    return (
      <div className="rc-animate-pages">
        <Checkbox onChange={() => this.toggle('enter')} checked={enter}>show</Checkbox>
        <Checkbox onChange={() => this.toggle('exclusive')} checked={exclusive}>exclusive</Checkbox>
        <Animate
          component="div"
          className="animate-group"
          exclusive={exclusive}
          showProp="show"
          transitionName="fade"
        >
          <Div show={enter} style={style} key="red" />
          <Div show={enter} style={style} key="blue" />
        </Animate>
      </div>
    )
  }
}
// fade-leave fade-enter fade-appear
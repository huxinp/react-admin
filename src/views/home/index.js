import React from 'react';

export default class Home extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      a: 123
    }
  }
  render() {
    const { a } = this.state;
    return (
      <div>
        Home {a}
      </div>
    )
  }
}
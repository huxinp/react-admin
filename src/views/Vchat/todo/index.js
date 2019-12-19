import React, { PropTypes } from 'react';

import DialogTodo from './DialogTodo';

import './index.less';

export default class Todo extends React.PureComponent {

  render() {
    return (
      <div className="todo">
        Todo
        <DialogTodo />
      </div>
    )
  }
}
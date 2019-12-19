import React from 'react';
import { createEventHandler } from '../utils';
import TodoActions from '../actions';

const ENTRY_KEY = 13;

export default class TodoHeader extends React.PureComponent {
  
  componentWillMount() {
    const newFiledKeyDown = createEventHandler();
    const enterEvent = newFiledKeyDown.filter(function (event) {
      return event.keyCode === ENTRY_KEY;
    })
    enterEvent.forEach(function (event) {
      event.stopPropagation();
      event.preventDefault();
    })
    enterEvent
      .map(function (event) {
        return event.target.value.trim();
      })
      .filter(function (value) {
        return !!value;
      })
      .subscribe(TodoActions.create);
    
    this.handlers = {
      newFiledKeyDown,
    }
  }

  render() {
    return (
      <header className="todo-header">
        <h1>todos</h1>
        <input
          className="todo-input"
          placeholder="What needs to be done?"
          autoFocus={true}
          onKeyDown={this.handlers.newFiledKeyDown}
        />
      </header>
    )
  }
}
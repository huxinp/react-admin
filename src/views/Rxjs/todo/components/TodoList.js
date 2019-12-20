import React from 'react';
import { createEventHandler } from '../utils';
import TodoActions from '../actions';
import TodoItem from './TodoItem';

export default class TodoList extends React.PureComponent {
  
  componentWillMount() {
    const toggleAllChange = createEventHandler();
    toggleAllChange
      .map(function (event) {
        return event.target.checked;
      })
      .subscribe(TodoActions.toggleAll);
    
    this.handlers = {
      toggleAllChange,
    }
  }

  render() {
    const { activeTodoCount, todos } = this.props;
    return (
      <section className="todo-main">
        <input
          className="toggle-all"
          type="checkbox"
          checked={activeTodoCount === 0}
          onChange={this.handlers.toggleAllChange}
        />
        <div className="todo-list">
          { todos.map(todo => <TodoItem key={todo.id} todo={todo} />) }
        </div>
      </section>
    )
  }
}
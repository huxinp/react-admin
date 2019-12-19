import React from 'react';
import { pluralize, createEventHandler } from '../utils';
import TodoActions from '../actions';

export default class TodoFooter extends React.PureComponent {

  componentWillMount() {
    const clearButtonClick = createEventHandler();
    clearButtonClick.subscribe(TodoActions.clearCompleted);
    this.handlers = {
      clearButtonClick
    }
  }

  render() {
    const { count, completedCount, nowShowing } = this.props;
    const activeTodoWord = pluralize(count, 'item')
    return (
      <footer className="todo-footer">
        <span className="todo-count">
          <strong> { count }</strong> {activeTodoWord} left
        </span>
        <div className="filters">
          <span>All</span>
          <span>Active</span>
          <span>Completed</span>
        </div>
        { !!completedCount && (
            <button
              className="clear-completed"
              onClick={this.handlers.clearButtonClick}
            >
              Clear completed ({ completedCount })
            </button>
          )
        }
      </footer>
    )
  }
}
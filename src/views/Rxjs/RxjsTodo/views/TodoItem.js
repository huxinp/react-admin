import React from 'react';
import { createEventHandler, RxLifecycleMixin } from '../utils';
import TodoActions from '../actions';

const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

export default React.createClass({
  mixins: [RxLifecycleMixin],
  getInitialState() {
    return {
      editing: false,
      editText: this.props.todo.title,
    }
  },
  componentWillMount() {
    const setState = this.setState.bind(this);
    const toggleClick = createEventHandler();
    toggleClick
      .map(this.getTodo)
      .subscribe(TodoActions.toggle);
    
    const destroyButtonClick = createEventHandler();
    destroyButtonClick
      .map(this.getTodo)
      .subscribe(TodoActions.destroy);
    
    const labelDoubleClick = createEventHandler();
    labelDoubleClick
      .map(function () { return { editing: true } })
      .subscribe(setState);

    const editFieldKeyDown = createEventHandler();
    editFieldKeyDown
      .filter(function (event) {
        return event.keyCode === ESCAPE_KEY;
      })
      .map(function () {
        return {
          editing: false,
          editText: this.props.todo.title
        }
      }.bind(this))
      .subscribe(setState)
    
    editFieldKeyDown
      .filter(function (event) {
        return event.keyCode === ENTER_KEY;
      })
      .subscribe(this.submit)
    
    const editFieldBlur = createEventHandler();
    editFieldBlur
      .subscribe(this.submit);

    const editFieldChange = createEventHandler();
    editFieldChange
      .map(function (e) {
        return {
          editText: e.target.value
        }
      })
      .subscribe(setState);
    
  this.lifecycle.componentDidUpdate
    .filter(function (prev) {
      return this.state.editing && !prev.prevState.editing;
    }.bind(this))
    .subscribe(function () {
      const node = this.ref_editField;
      if (node) {
        node.focus();
        node.value = this.props.todo.title;
        node.setSelectionRange(node.value.length, node.value.length);
      }
    }.bind(this))

    this.handlers = {
      toggleClick,
      destroyButtonClick,
      labelDoubleClick,
      editFieldKeyDown,
      editFieldBlur,
      editFieldChange,
    } 
  },
  submit() {
    const val = this.state.editText.trim();
    if (val) {
      TodoActions.updateTitle.next({
        text: val,
        todo: this.getTodo()
      })
      this.setState({
        editText: val,
        editing: false
      })
    } else {
      TodoActions.destroy.next(this.props.todo);
    }
  },
  getTodo() {
    return this.props.todo;
  },
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.todo !== this.props.todo ||
      nextState.editing !== this.state.editing ||
      nextState.editText !== this.state.editText
    )
  },
  render() {
    const { todo } = this.props;
    const { editing, editText } = this.state;
    return (
      <div className={`${ todo.completed ? 'completed' : ''} ${editing ? 'editing' : ''}`}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            onChange={this.handlers.toggleClick}
            checked={todo.completed}
          />
          <label onDoubleClick={this.handlers.labelDoubleClick}>
            { todo.title }
          </label>
          <button className="destroy" onClick={this.handlers.destroyButtonClick} />
        </div>
        <input 
          ref={el => this.ref_editField = el}
          className="edit"
          onKeyDown={this.handlers.editFieldKeyDown}
          onBlur={this.handlers.editFieldBlur}
          value={editText}
          onChange={this.handlers.editFieldChange}
        />
      </div>
    )
  }
})
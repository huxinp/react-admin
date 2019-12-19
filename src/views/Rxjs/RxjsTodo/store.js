import Rx from 'rxjs/Rx';
import { assign, store } from './utils';

export default function TodoStore(key) {
  this.updates = new Rx.BehaviorSubject(store(key));

  this.todos = this.updates.scan(function(todos, operation) {
    return operation(todos);
  })

  this.key = key;
  this.todos.forEach(function(todos) {
    store(key, todos);
  })
}
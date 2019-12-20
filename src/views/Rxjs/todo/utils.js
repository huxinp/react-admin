
import Rx from 'rxjs/Rx';

export function assign(target, items) {
  items = [].slice.call(arguments);
  return items.reduce(function(target, item) {
    return Object.keys(item).reduce(function(target, property) {
      target[property] = item[property]
      return target;
    }, target);
  }, target)
}

export function store(namespace, data) {
  if (data) {
    return localStorage.setItem(namespace, JSON.stringify(data));
  }
  const localStore = localStorage.getItem(namespace);
  return (localStore && JSON.parse(localStore)) || []
}

export function uuid() {
  let i, random, result = '';
  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if ([8, 12, 16, 20].includes(i)) {
      result += '-';
    }
    result += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
      .toString(16);
  }
  return result
}

export function pluralize (count, word) {
  return count === 1 ? word : word + 's';
}

function getEnumerablePropertyNames(target) {
  const result = [];
  for (let key in target) {
    result.push(key);
  }
  return result
}

export function createEventHandler () {
  const subject = function() {
    subject.next.apply(subject, arguments);
  }
  getEnumerablePropertyNames(Rx.Subject.prototype).forEach(function (property) {
    subject[property] = Rx.Subject.prototype[property];
  })
  Rx.Subject.call(subject);
  return subject;
}

export const RxLifecycleMixin = {
  componentWillMount() {
    this.lifecycle = {
      componentWillMount: new Rx.Subject(),
      componentDidMount: new Rx.Subject(),
      componentWillReceiveProps: new Rx.Subject(),
      componentWillUpdate: new Rx.Subject(),
      componentDidUpdate: new Rx.Subject(),
      componentWillUnmount: new Rx.Subject()
    }
  },
  componentDidMount() {
    this.lifecycle.componentDidMount.next();
  },
  componentWillReceiveProps(nextProps) {
    this.lifecycle.componentWillReceiveProps.next(nextProps)
  },
  componentWillUpdate(nextProps, nextState) {
    this.lifecycle.componentWillUpdate.next({ nextProps, nextState })
  },
  componentDidUpdate(prevProps, prevState) {
    this.lifecycle.componentDidUpdate.next({ prevProps, prevState })
  },
  componentWillUnmount() {
    this.lifecycle.componentWillUnmount.next();
  }
}

import React, { PropTypes } from 'react';
import Rx from 'rxjs/Rx';
import { browserHistory  } from 'react-router';
import TodoStore from './store';
import TodoActions from './actions';
import request, { md5 } from '@/request'

import Footer from './components/Footer';
import Header from './components/Header';
import TodoList from './components/TodoList';

import './index.less';

const todoStore = new TodoStore('rxjs-todos');

TodoActions.register(todoStore.updates);

export default class RxjsTodo extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      todoStore,
      routeHash: 'all', // one of ['all', 'active', 'completed' ]
      activeTodoCount: 0,
      completedCount: 0,
      shownTodos: 0,
    }
  }

  componentDidMount() {
  /* 
    function subscribe(observer) {
      let i = 0;
      observer.next(i++)
      const timer = setInterval(() => {
        observer.next('hi')
        observer.next(i++)
      }, 1000)
      return function unsubscribe() {
        console.log('clearInterval')
        observer.complete();
        clearInterval(timer);
      }
    }
    const interval = Rx.Observable.create(subscribe);
    const unsubscribe = subscribe({ next: x => console.log(x) });
    interval.subscribe({
      next: x => {
        if (x === 10) {
          unsubscribe();
        }
      },
      complete: () => console.log('done')
    })
    unsubscribe();
    const observable = Rx.Observable.create(subscribe)
    console.log('just before subscribe', observable)
    observable.subscribe({
      next: x => console.log('got value ' + x),
      error: err => console.error('something wrong occurred: ' + err),
      complete: () => console.log('done'),
    })
    console.log('just after subscribe')
   */
  /*
    const foo = Rx.Observable.create(function (observer) {
      console.log('Hello');
      observer.next(42);
    })
    foo.subscribe(function (x) {
      console.log(x)
    })
    foo.subscribe(function (x) {
      console.log(x)
    })
   */
  /*
    const theOf = Rx.Observable.of(1,2,3)
    theOf.subscribe(x => console.log('theOf ' + x))
   */
  /* 
    // 创建观察对象
    const login = Rx.Observable.create(function subscribe(observer) {
      request({
        method: 'post',
        url: '/v/user/login',
        data: {name: 'Vchat', pass: md5('111111')}
      }).then(res => {
        if (res.code === 0) {
          console.log('before next', res)
          observer.next(res);
        } else {
          console.log('before next')
          observer.next(res);
        }
      }).catch(err => observer.error(err))
    })
    const subscription = login.subscribe({ // 订阅（观察者）
      next: function(res) {
        console.log('next', res)
      },
      error: function(err) {
        console.log('error', err)
      }
    })
    subscription.unsubscribe(); // 取消订阅
   */
  /* 
    function subscribe(observer) {
      let i = 0;
      const intervalId = setInterval(() => {
        observer.next(i++)
      }, 1000)
      return function unsubscribe() {
        console.log('before clearInterval')
        clearInterval(intervalId);
      }
    }
    const observable = Rx.Observable.create(subscribe)
    const subscription = observable.subscribe({
      next: x => {
        console.log(x)
        if (x === 3) {
          subscription.unsubscribe();
        }
      }
    })
   */
  /* 
    function multiplyByTen(input) {
      const output = Rx.Observable.create(function subscribe(observer) {
        input.subscribe({
          next: v => observer.next(10 * v),
          error: err => observer.error(err),
          complete: () => observer.complete()
        })
      })
      return output
    }

    const input  = Rx.Observable.from([1,2,3,4]);
    const output = multiplyByTen(input);
    output.subscribe(x => console.log(x))
   */
  /* 
    Rx.Observable.prototype.multiplyByTen = function multiplyByTen() {
      const input = this;
      return Rx.Observable.create(function subscribe(observer) {
        input.subscribe({
          next: v => observer.next(v * 10),
          error: err => observer.error(err),
          complete: () => observer.complete()
        })
      })
    }
    var observable = Rx.Observable.from([1,2,3,4]).multiplyByTen();
    observable.subscribe(x => console.log(x));
   */
  /* 
    const observable1 = Rx.Observable.interval(400);
    const observable2 = Rx.Observable.interval(300);

    const subscription = observable1.subscribe(x => console.log('first: ' + x));
    const childSubscription = observable2.subscribe(x => console.log('second: ' + x));

    subscription.add(childSubscription);

    setTimeout(() => {
      subscription.unsubscribe();
    }, 1000);
   */
  /* 
    const observable = Rx.Observable.create(function (observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    })
    .observeOn(Rx.Scheduler.async);

    console.log('just before subscribe');
    observable.subscribe({
      next: x => console.log('got value ' + x),
      error: err => console.error('something wrong occurred: ' + err),
      complete: () => console.log('done'),
    })
    console.log('just after subscribe');
   */
  /* 
    const observable = Rx.Observable.create(function (proxyObserver) {
      proxyObserver.next(1);
      proxyObserver.next(2);
      proxyObserver.next(3);
      proxyObserver.complete();
    })
    .observeOn(Rx.Scheduler.async);

    const finalObserver = {
      next: x => console.log('got value ' + x),
      error: err => console.error('something wrong occurred: ' + err),
      complete: () => console.log('done')
    }

    console.log('just before subscribe');
    observable.subscribe(finalObserver);
    console.log('just after subscribe');

    const proxyObserver = {
      next: val => {
        Rx.Scheduler.async.schedule(
          x => finalObserver.next(x),
          0,
          val
        )
      }
    }
   */
  /* 
    const subject = new Rx.Subject();

    subject.subscribe({
      next: v => console.log('observerA: ' + v)
    })
    subject.subscribe({
      next: v => console.log('observerB: ' + v)
    })

    subject.next(1);
    subject.next(2);
   */
  /* 
    const subject = new Rx.Subject();
    
    subject.subscribe({
      next: v => console.log('observerA: ' + v)
    })
    subject.subscribe({
      next: v => console.log('observerB: ' + v)
    })

    const observable = Rx.Observable.from([1,2,3]);

    observable.subscribe(subject);
   */
  /* 
    const source = Rx.Observable.from([1,2,3]);
    const subject = new Rx.Subject();
    const multicasted = source.multicast(subject);

    multicasted.subscribe({
      next: v => console.log('observerA: ' + v)
    })
    multicasted.subscribe({
      next: v => console.log('observerB: ' + v)
    })

    multicasted.connect();
   */
  /* 
    const source = Rx.Observable.interval(500);
    const subject = new Rx.Subject();
    const multicasted = source.multicast(subject);
    let subscription1, subscription2, subscriptionConnect;

    subscription1 = multicasted.subscribe({
      next: v => console.log('observerA: ' + v)
    })

    subscriptionConnect = multicasted.connect();

    setTimeout(() => {
      subscription2 = multicasted.subscribe({
        next: v => console.log('observerB: ' + v)
      })
    }, 600);

    setTimeout(() => {
      subscription1.unsubscribe();
    }, 1200)

    setTimeout(() => {
      subscription2.unsubscribe();
      subscriptionConnect.unsubscribe();
    }, 2000)
   */
  /* 
    const source = Rx.Observable.interval(500);
    const subject = new Rx.Subject();
    const refCounted = source.multicast(subject).refCount();
    let subscription1, subscription2, subscriptionConnect;

    console.log('observerA subscribed');
    subscription1 = refCounted.subscribe({
      next: v => console.log('observerA: ' + v)
    })

    setTimeout(() => {
      console.log('observerB subscribed')
      subscription2 = refCounted.subscribe({
        next: v => console.log('observerB: ' + v)
      })
    }, 600);

    setTimeout(() => {
      console.log('observerA unsubscribed')
      subscription1.unsubscribe();
    }, 1200)

    setTimeout(() => {
      console.log('observerB unsubscribed');
      subscription2.unsubscribe();
    }, 2000)
   */
  /* 
    const subject = new Rx.BehaviorSubject(0)

    subject.subscribe({
      next: v => console.log('observerA: ' + v)
    })

    subject.next(1)
    subject.next(2);

    subject.subscribe({
      next: v => console.log('observerB: ' + v)
    })

    subject.next(3)
   */
  /* 
    const subject = new Rx.ReplaySubject(3);

    subject.subscribe({
      next: v => console.log('observerA: ' + v)
    })

    subject.next(1)
    subject.next(2)
    subject.next(3)
    subject.next(4)

    subject.subscribe({
      next: v => console.log('observerB: ' + v)
    })

    subject.next(5)
   */
  /* 
    const subject = new Rx.ReplaySubject(100, 500);

    subject.subscribe({
      next: v => console.log('observerA: ' + v)
    })

    let i = 1;
    setInterval(() => subject.next(i++), 200);

    setTimeout(() => {
      subject.subscribe({
        next: v => console.log('observerB: ' + v)
      })
    }, 1000)
   */
  /* 
    const subject = new Rx.AsyncSubject();

    subject.subscribe({
      next: v => console.log('observerA: ' + v)
    })

    subject.next(1)
    subject.next(2)
    subject.next(3)
    subject.next(4)

    subject.subscribe({
      next: v => console.log('observerB: ' + v)
    })

    subject.next(5)
    subject.complete()
   */
  }

  componentWillMount() {
    const { todoStore } = this.state;
    console.log('todoStore', todoStore)
    const routeHash = new Rx.BehaviorSubject('');
    browserHistory.listen(e => {
      switch (e.hash) {
        case '#all':
          routeHash.next('all');
          break;
        case '#active':
          routeHash.next('active');
          break;
        case '#completed':
          routeHash.next('completed');
          break;
        default: 
          console.log(e.hash)
      }
    })
    const shownTodos = todoStore.todos
      .combineLatest(
        routeHash,
        function (todos, routeHash) {
          console.log('todos', todos)
          const activeTodoCount = todos.reduce(function (accum, todo) {
            return todo.completed ? accum : accum + 1;
          }, 0)
          const completedCount = todos.length - activeTodoCount;
          const shownTodos = todos.filter(function (todo) {
            switch (routeHash) {
              case 'active':
                return !todo.completed;
              case 'completed':
                return todo.completed;
              default:
                return true
            }
          }, this)
          return {
            activeTodoCount,
            completedCount,
            shownTodos,
            routeHash,
          }
        }
      )
      .subscribe(this.setState.bind(this))
  }

  render() {
    const { activeTodoCount, completedCount, shownTodos, routeHash } = this.state;
    return (
      <div className="rxjs-todo">
        <Header />
        { shownTodos && (
            <TodoList todos={shownTodos} activeTodoCount={activeTodoCount} />
          )
        }
        { !!(activeTodoCount || completedCount) && (
            <Footer count={activeTodoCount} completedCount={completedCount} nowShowing={routeHash} />
          )
        }
      </div>
    )
  }
}
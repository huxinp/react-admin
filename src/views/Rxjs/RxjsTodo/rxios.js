import Rx from 'rxjs/Rx';
import Axios from 'axios';

const request = Axios.create({
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

function rxios (requestConfig) {
  return new Rx.Observable(function subscribe(observer) {
    request(requestConfig).then(res => {
      observer.next(res.data);
      observer.complete();
    }).catch(err => {
      observer.error(err);
    })
  })
}

rxios({
  method: 'get',
  url: '',
  param: 123,
}).subscribe({
  next: res => {
    if (res.code === 0) {

    } else {

    }
  },
  error: err => {
    console.log('rxios err: ', err)
  },
  complete: () => {
    console.log('rxios done!')
  }
})
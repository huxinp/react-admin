import Rx from 'rxjs';
import request from '@/src/request';

const request$ = ({method, url, params}) => Rx.Observable.create(function (subscribe) {
  request({
    method,
    url,
    data: params,
  })
  .then(res => {
    subscribe.next(res.body);
    subscribe.complete();
  })
  .catch(err => subscribe.error(err));
})

export default request$;
import Rx from 'rxjs/Rx';

import request$ from '../api/api-json';
const API_URL = 'http://jsonplaceholder.typicode.com/'

const jsonSubjects = {
  goGetJSON: new Rx.Subject(),
  goPostJSON: new Rx.Subject()
}

export default {
  jsonSubjects,
  getJSON: () => request$({
    method: 'get',
    url: API_URL + 'posts',
  }).subscribe(jsonSubjects.goGetJSON.next.bind(this)),
  postJSON: () => request$({
    method: 'get',
    url: API_URL + 'available'
  }).subscribe(jsonSubjects.goPostJSON.next.bind(this)),
}
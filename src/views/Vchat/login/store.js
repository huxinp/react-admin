import EventEmitter from 'events';
import Dispatcher from '../dispatcher';

import {
  LOGIN_LOADING,
} from './constants';

const store = {
  userInfo: {},
  loading: false,
}

const AppStore = Object.assign(new EventEmitter(), {
  getUserInfo: () => store.userInfo,
  getLoading: () => store.loading,
});

const _emit = () => AppStore.emit('UPDATE');

// AppStore.on(name, callback);
// AppStore.removeListener(name, callback);

Dispatcher.register(payload => {
  switch(payload.type) {
    case LOGIN_LOADING:
      store.loading = true;
      _emit();
      break;
    default:
      console.log('uncased payload type', payload.type)
  }
})

export default AppStore;
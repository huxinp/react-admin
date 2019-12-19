
import Dispatcher from '../dispatcher';
import request, { md5 } from '../../../request'
import { browserHistory } from 'react-router';
import {
  LOGIN,
  LOGIN_LOADING,
  LOGIN_SUCCEED,
  LOGIN_FAILED,
  GET_USER_INFO,
  GET_USER_INFO_SUCCEED,
  GET_USER_INFO_FAILED
} from './constants';

export const login = function(params) {
  Dispatcher.execute(LOGIN_LOADING);
  params.pass = md5(params.pass);
  request({
    method: 'post',
    url: '/v/user/login',
    data: params
  }).then(res => {
    if (res.code === 0) {
      getUserInfo();
      Dispatcher.execute(LOGIN_SUCCEED, res)
      browserHistory.push('/')
    } else {
      Dispatcher.execute(LOGIN_FAILED);
    }
  }).catch(err => {
    Dispatcher.execute(LOGIN_FAILED);
    console.log('login catch err: ', err)
  });
}
export const getUserInfo = function() {
  request({
    method: 'post',
    url: '/v/user/getUserInfo'
  }).then(res => {
    if (res.code === 0) {
      Dispatcher.execute(GET_USER_INFO_SUCCEED, res.data);
      getVchatInfo()
    } else {
      Dispatcher.execute(GET_USER_INFO_FAILED, {});
    }
  }).catch(err => {
    Dispatcher.execute(GET_USER_INFO_FAILED);
    console.error('getUserInfo catch err: ', err);
  })
}
export const getVchatInfo = function() {
  request({
    method: 'post',
    url: 'v/user/getVchatInfo',
  }).then(res => {
    if (res.code === 0) {
      const id = res.data.id;
      Dispatcher.execute('setConversationsList', Object.assign({}, res.data, { type: 'vchat' }, {id}));
    }
  }).catch(err => {
    console.log('getVchatInfo catch err: ', err);
  })
}

import {
  login,
} from './api';

export function loginAction (params) {
  return login(params)
}
import axios from 'axios';
import crypto from 'crypto';
import { browserHistory } from 'react-router'

const md5 = pass => { // 避免多次调用MD5报错
    let md5 = crypto.createHash('md5');
    return md5.update(pass).digest("hex");
};

export {
  md5
}

const request = axios.create({
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});
// 请求状态拦截
request.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.status === 200) {
      return
    }
    return Promise.resolve(res);
  },
  error => {
    // Toast('服务器异常')
    console.log(error);
    return Promise.reject(error);
  }
)
// 未登录拦截
request.interceptors.response.use(
  response => { // 这里判断是否登录
    // if (response.data.status === 0) {
    //   browserHistory.push('/Vchat/login');
    // }
    return response;
  },
  error => {
    if (error.response) {
      console.log('error status', error.response.status)
      alert('网络错误， 请重试');
      switch (error.response.status) {
        case 401:
          // 这里写清除token的代码
          browserHistory.push('/Vchat/login');
          break;
        default:
          browserHistory.push('/Vchat/login');
      }
    }
    return Promise.reject(error);
  }
)
export default request;
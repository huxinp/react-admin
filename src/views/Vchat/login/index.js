import React from 'react';

import Canvas from 'vchat-regcode';

import { loginAction } from './actions';

import AppStore from './store';

import './index.less';

export default class Login extends React.PureComponent {
  state = {
    signForm: {
      name: '',
      pass: '',
      regcode: '',
      repass: ''
    },
    isLogin: true,
    showSign: false,
    regcode: '',
    signSuccess: {
      code: '',
      visible: false,
    },
    loading: false,
  }
  ref_regcode = null
  regCodeClass = null;
  componentDidMount() {
  }
  componentWillUnmount() {
    this.ref_regcode = null
    this.regCodeClass = null;
  }
  experience = () => {
    this.setState({ showSign: true }, () => {
      if (!this.ref_regcode) return
      this.regCodeClass = new Canvas(this.ref_regcode, {
        fontSize: 20,
        lineNum: 2,
        dotNum: 10
      });
      this.regCodeClass.draw((r) => {
        this.setState({ regcode: r })
      });
    })
  }
  enter = () => {
    const { signForm, showSign } = this.state;
    const { name, pass, regcode, repass } = signForm;
    loginAction({ name, pass })
  }
  choose = flag => {
    this.setState({ isLogin: flag })
  }
  inputHandle = (e, type) => {
    const signForm = {...this.state.signForm};
    this.setState({
      signForm: Object.assign({}, signForm, { [type]: e.target.value })
    });
  }
  render() {
    const { showSign, isLogin, signForm } = this.state;
    return (
      <div className="vchat-login">
        <div className="fork-me-on-github">
          <a href="https://github.com/wuyawei" target="_blank">fork me</a>
        </div>
        <div className={`logo${showSign ? ' active' : ''}`}>
          <h3 className="title">Hi, Vchat!</h3>
          <span className="begain" onClick={this.experience}>立即体验</span>
        </div>
        {
          showSign && (
            <div className="sign">
              <div className="title">
                <span className={isLogin ? 'active' : ''} onClick={e => this.choose(true)}>登录</span>
                <span className={isLogin ? '' : 'active'} onClick={e => this.choose(false)}>注册</span>
              </div>
              <div className="sign-form">
                <div>
                  <div className="label">账号</div>
                  <div>
                    <input type="text" onChange={e => this.inputHandle(e, 'name')} value={signForm.name} />
                  </div>
                </div>
                <div>
                  <div className="label">密码</div>
                  <div>
                    <input type="password" onChange={e => this.inputHandle(e, 'pass')} value={signForm.pass} />
                  </div>
                </div>
                {
                  !isLogin && (
                    <div>
                      <div className="label">确认密码</div>
                      <div>
                        <input type="password" onChange={e => this.inputHandle(e, 'repass')} value={signForm.repass} />
                      </div>
                    </div>
                  )
                }
                <div className="regcode-box">
                  <input type="text" placeholder="验证码" onChange={e => this.inputHandle(e, 'regcode')} value={signForm.regcode} />
                  <canvas width="90" height="38" ref={el => this.ref_regcode = el}></canvas>
                </div>
              </div>
              <button onClick={e => this.enter(isLogin)}>
                { isLogin ? '登录' : '注册' }
              </button>
              {
                isLogin && (
                  <div className="login-foot">
                    <span></span>
                    第三方登录
                    <span></span>
                  </div>
                )
              }
            </div>
          )
        }
      </div>
    )
  }
}
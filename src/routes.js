
function loadModule(cb) {
  return function (component) {
    return cb(null, component.default);
  }
}
function createRoutesLog(path, err) {
  console.error(`createRoutes path ${path} catch err: `, err)
}
export default function createRoutes () {
  return [
    {
      path: '/login',
      name: 'login',
      getComponent(nextState, cb) {
        import('./views/login').then(loadModule(cb))
          .catch(err => createRoutesLog(this.path, err))
      }
    },
    {
      path: '/todo',
      name: 'todo',
      getComponent(nextState, cb) {
        import('./views/todo').then(loadModule(cb))
          .catch(err => createRoutesLog(this.path, err))
      }
    },
    {
      path: '/setting',
      name: 'setting',
      getComponent(nextState, cb) {
        import('./views/setting').then(loadModule(cb))
          .catch(err => createRoutesLog(this.path, err))
      }
    },
    {
      path: '/antDesign',
      name: 'antDesign',
      getComponent(nextState, cb) {
        import('./views/antDesign').then(loadModule(cb))
          .catch(err => createRoutesLog(this.path, err))
      }
    },
    {
      path: '/Vchat',
      name: 'Vchat',
      getComponent(nextState, cb) {
        import('./views/Vchat').then(loadModule(cb))
          .catch(err => createRoutesLog(this.path, err))
      }
    },
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        import('./views/home').then(loadModule(cb))
          .catch(err => createRoutesLog(this.path, err))
      }
    },
    {
      path: '*',
      name: 'notFound',
      getComponent(nextState, cb) {
        import('./views/notFound').then(loadModule(cb))
          .catch(err => createRoutesLog(this.path, err))
      }
    },
  ]
}

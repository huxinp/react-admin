
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
      path: '/antDesign',
      name: 'antDesign',
      getComponent(nextState, cb) {
        import('./pages/antDesign').then(loadModule(cb))
          .catch(err => createRoutesLog(this.path, err))
      }
    },
    {
      path: '/Vchat',
      name: 'Vchat',
      getComponent(nextState, cb) {
        import('./pages/Vchat').then(loadModule(cb))
          .catch(err => createRoutesLog(this.path, err))
      }
    },
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        import('./pages/home').then(loadModule(cb))
          .catch(err => createRoutesLog(this.path, err))
      }
    },
    {
      path: '*',
      name: 'notFound',
      getComponent(nextState, cb) {
        import('./pages/home').then(loadModule(cb))
          .catch(err => createRoutesLog(this.path, err))
      }
    },
  ]
}

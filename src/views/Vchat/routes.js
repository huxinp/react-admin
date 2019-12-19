
import store from './store';

function loadModule(cb) {
  return function (component) {
    return cb(null, component.default);
  }
}
function createRoutesLog(path, err) {
  console.error(`createRoutes path ${path} catch err: `, err)
}
function createRoutes (store, basePath) {
  return [
    {
      path: basePath,
      name: 'Vchat',
      indexRoute: {
        getComponent(nextState, cb) {
          import('./home').then(loadModule(cb))
            .catch(err => createRoutesLog(this.path, err))
        },
      },
      getComponent(nextState, cb) {
        import('./index').then(loadModule(cb))
          .catch(err => createRoutesLog(this.path, err))
      },
      childRoutes: [
        {
          path: basePath + '/login',
          name: 'Login',
          getComponent(nextState, cb) {
            import('./login').then(loadModule(cb))
              .catch(err => createRoutesLog(this.path, err));
          }
        },
        {
          path: basePath + '/todo',
          name: 'todo',
          getComponent(nextState, cb) {
            import('./todo').then(loadModule(cb))
              .catch(err => createRoutesLog(this.path, err))
          }
        },
        {
          path: basePath + '/setting',
          name: 'setting',
          getComponent(nextState, cb) {
            import('./setting').then(loadModule(cb))
              .catch(err => createRoutesLog(this.path, err))
          }
        },
      ]
    }
  ]
}

export default function VchatRoutes(basePath) {
  return createRoutes(store, basePath)
}
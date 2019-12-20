
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
      name: 'Rxjs',
      indexRoute: {
        getComponent(nextState, cb) {
          import('./todo').then(loadModule(cb))
            .catch(err => createRoutesLog(this.path, err))
        }
      },
      getComponent(nextState, cb) {
        import('./index').then(loadModule(cb))
          .catch(err => createRoutesLog(this.path, err))
      },
      childRoutes: [
        {
          path: basePath + '/todo',
          name: 'RxjsTodo',
          getComponent(nextState, cb) {
            import('./todo').then(loadModule(cb))
              .catch(err => createRoutesLog(this.path, err))
          }
        },
      ]
    },
  ]
}

export default function RxjsRoutes(basePath) {
  return createRoutes(store, basePath)
}
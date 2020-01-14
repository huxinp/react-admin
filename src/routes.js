
import VchatRoutes from './views/Vchat/routes';
import RxjsRoutes from './views/Rxjs/routes';

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
      path: '/',
      name: 'Home',
      getComponent(nextState, cb) {
        import('./views/home').then(loadModule(cb))
          .catch(err => createRoutesLog(this.path, err))
      }
    },
    {
      path: '/antDesign',
      name: 'AntD',
      // indexRoute: {
      //   getComponent(nextState, cb) {
      //     import('./views/antDesign/calendar').then(loadModule(cb))
      //       .catch(err => createRoutesLog(this.path, err))
      //   },
      // },
      getComponent(nextState, cb) {
        import('./views/antDesign').then(loadModule(cb))
          .catch(err => createRoutesLog(this.path, err))
      },
      // childRoutes: [
      //   {
      //     path: '/antDesign/calendar',
      //     name: 'Calendar',
      //     getComponent(nextState, cb) {
      //       import('./views/antDesign/calendar').then(loadModule(cb))
      //         .catch(err => createRoutesLog(this.path, err))
      //     },
      //   }
      // ]
    },
    ...VchatRoutes('/Vchat'),
    ...RxjsRoutes('/Rxjs'),
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

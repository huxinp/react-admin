

import DatePickerPage from './pages/date-picker';
import WebrtcStreamPage from './pages/webrtc-stream';
import Choose from './pages/choose';
import DragSortPage from './pages/dragsort';
import RcDatePickerPage from './pages/rc-date-picker';
import ReactComponents from './pages/react-component';
import RcAnimate from './pages/rcAnimate';

export default function createRoutes () {
  return [
    {
      path: '/datepicker',
      name: 'datepicker',
      component: DatePickerPage,
      // getComponent: function(nextState, cb) {
      //   console.log(1111111)
      //   import("./pages/date-picker").then(component => {
      //     console.log('datepicker', component);
      //     cb(null, component)
      //   })
      // },
    },
    {
      path: '/webrtcstream',
      name: 'webrtcstream',
      component: WebrtcStreamPage,
      // getComponents: function(nextState, cb) {
      //   import("./pages/webrtc-stream").then(component => {
      //     console.log('webrtcstream', component);
      //     cb(null, component)
      //   })
      // },
    },
    {
      path: '/choose',
      name: 'choose',
      component: Choose,
      // getComponents: function(nextState, cb) {
      //   import("./pages/choose").then(component => {
      //     console.log('choose', component);
      //     cb(null, component)
      //   })
      // },
    },
    {
      path: '/dragsort',
      name: 'dragsort',
      component: DragSortPage,
      // getComponents: function(nextState, cb) {
      //   import("./pages/dragsort").then(component => {
      //     console.log('dragsort', component);
      //     cb(null, component)
      //   })
      // },
    },
    {
      path: '/rc-date-picker',
      name: 'rc-date-picker',
      component: RcDatePickerPage,
      // getComponents: function(nextState, cb) {
      //   import("./pages/rc-date-picker").then(component => {
      //     console.log('rc-date-picker', component);
      //     cb(null, component)
      //   })
      // },
    },
    {
      path: '/react-components',
      name: 'react-components',
      component: ReactComponents,
      // getComponents: function(nextState, cb) {
      //   import("./pages/react-component").then(component => {
      //     console.log('react-component', component);
      //     cb(null, component)
      //   })
      // },
    },
    {
      path: '/rc-animate',
      name: 'rc-animate',
      component: RcAnimate,
      // getComponents: function(nextState, cb) {
      //   import("./pages/rcAnimate").then(component => {
      //     console.log('rcAnimate', component);
      //     cb(null, component)
      //   })
      // },
    }
  ]
}



import DatePickerPage from './pages/date-picker';
import WebrtcStreamPage from './pages/webrtc-stream';
import Choose from './pages/choose';
import DragSortPage from './pages/dragsort';

export default function createRoutes () {
  return [
    {
      path: '/datepicker',
      name: 'datepicker',
      component: DatePickerPage,
    },
    {
      path: '/webrtcstream',
      name: 'webrtcstream',
      component: WebrtcStreamPage
    },
    {
      path: '/choose',
      name: 'choose',
      component: Choose,
    },
    {
      path: '/dragsort',
      name: 'dragsort',
      component: DragSortPage,
    }
  ]
}
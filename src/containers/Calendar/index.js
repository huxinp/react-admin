import React from 'react';
import Calendar from '@/rc-components/Calendar';
export default class CalendarFeature extends React.PureComponent {

  render() {
    return (
      <div className="feature calendar-feature">
        <Calendar />
      </div>
    )
  }
}
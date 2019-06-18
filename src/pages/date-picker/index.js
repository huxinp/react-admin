import React from 'react';
import './index.scss';
import Calendar from '../../components/Calendar';
import DatePicker from '../../components/DatePicker'

export default class DatePickerPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      timestamp: new Date().getTime(),
    }
  }
  render() {
    return (
      <div className="date-picker-containers">
        <DatePicker value={new Date()} openDate={new Date()} mondayFirst={false} />
        <Calendar.Day
          translation={{
            days: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            format: 'YYYY年MM月'
          }}
          pageDate={new Date(this.state.timestamp)}
          changeMonth={date => this.setState({
            timestamp: date.getTime(),
          })}
        />
        <Calendar.Month
          pageDate={new Date(this.state.timestamp)}
        />
        <Calendar.Year
          pageDate={new Date(this.state.timestamp)}
        />
        <Calendar.Week
          pageDate={new Date(this.state.timestamp)}
        />
      </div>
    )
  }
}
import React from 'react';
import PropTypes from 'prop-types';
import Trigger from 'rc-trigger';
import Align from 'rc-align';
import Popup from 'rc-trigger/lib/Popup';
import DateInput from '../DatePicker/DateInput';
import Calendar from '../Calendar';
import { validateDateInput } from '../Calendar/utils';
import { Cell, HeaderCell, Header } from '../Calendar/common';
import './index.scss';

class CustomRcDatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCalendar: false,
    }
  }
  componentDidMount() {

  }
  
  computedInitialView = () => {
    if (!this.props.initialView) {
      return this.props.minimumView
    }
    return this.props.initialView
  }
  
  allowedToShowView = view => {
    const views = ['day', 'month', 'year']
    const minimumViewIndex = views.indexOf(this.props.minimumView)
    const maximumViewIndex = views.indexOf(this.props.maximumView)
    const viewIndex = views.indexOf(view)
    return viewIndex >= minimumViewIndex && viewIndex <= maximumViewIndex
  }
  // 打开指定 calendar
  openCalendar = view => {
    if (!this.allowedToShowView(view)) {
      return false
    }
    this.close()
    const viewMap = {
      day: 'showDayView',
      month: 'showMonthView',
      year: 'showYearView',
    }
    this.setState({
      [viewMap[view]]: true,
    })
    return true
  }
  makeCalendar = () => {
    return (
      <Calendar.Day
        // selectedDate={selectedDate}
        pageDate={new Date()}
        mondayFirst={true}
        // changeMonth={}
        selectDate={d => console.log('selectDate', d)}
        selectedDisabled={d => console.log('selectedDisabled', d)}
        showMonthCalendar={() => console.log('showMonthCalendar')}
      />
    )
  }

  render () {
    const { showCalendar } = this.state;
    return React.createElement(
      Trigger,
      {
        popup: this.makeCalendar(),
        popupAlign: {
          points: ['tl', 'bl'],
          overflow: {
            adjustX: 1,
            adjustY: 1,
          },
          offset: [0, 3],
          targetOffsetG: [0, 0],
        },
        action: ['click'],
        destroyPopupOnHide: true,
        popupVisible: showCalendar,
        onPopupVisibleChange: this.onVisibleChange,
      },
      <DateInput
        showCalendar={() => this.setState({ showCalendar: true })}
        closeCalendar={() => this.setState({ showCalendar: false })}
        // selectedDate={selectedDate}
      />
    )
  }
}
CustomRcDatePicker.defaultProps = {

}
CustomRcDatePicker.propTypes = {

}

export default CustomRcDatePicker;

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePicker from '../../components/DatePicker';
import RcDatePicker from '../../components/RcDatePicker';
import RcRangePicker from '../../components/RcRangePicker';
import CustomRcDatePicker from '../../components/CustomRcDatePicker'
import Trigger from 'rc-trigger';
import './index.scss';


const formatStr = 'YYYY/MM/DD';

const autoAdjustOverflow = {
  adjustX: 1,
  adjustY: 1,
};

const targetOffsetG = [0, 0];

const placementAlignMap = {
  left: {
    points: ['cr', 'cl'],
    overflow: autoAdjustOverflow,
    offset: [-3, 0],
    targetOffsetG,
  },
  right: {
    points: ['cl', 'cr'],
    overflow: autoAdjustOverflow,
    offset: [3, 0],
    targetOffsetG,
  },
  top: {
    points: ['bc', 'tc'],
    overflow: autoAdjustOverflow,
    offset: [0, -3],
    targetOffsetG,
  },
  bottom: {
    points: ['tc', 'bc'],
    overflow: autoAdjustOverflow,
    offset: [0, 3],
    targetOffsetG,
  },
  topLeft: {
    points: ['bl', 'tl'],
    overflow: autoAdjustOverflow,
    offset: [0, -3],
    targetOffsetG,
  },
  topRight: {
    points: ['br', 'tr'],
    overflow: autoAdjustOverflow,
    offset: [0, -3],
    targetOffsetG,
  },
  bottomRight: {
    points: ['tr', 'br'],
    overflow: autoAdjustOverflow,
    offset: [0, 3],
    targetOffsetG,
  },
  bottomLeft: {
    points: ['tl', 'bl'],
    overflow: autoAdjustOverflow,
    offset: [0, 3],
    targetOffsetG,
  },
};
function noop () {}

function format(v) {
  return v ? v.format(formatStr) : '';
}


class RcDatePickerPage extends React.Component {
  state = {
    date: [moment(), moment().add(14, 'days')],
    start: moment(),
    end: moment().add(7, 'days'),
    endOpen: false,
    date1: moment().toDate().getTime(),
  }
  componentDidMount() {
    window.moment = moment;
  }
  onChange = (date, type) => {
    this.setState({ [type]: date });
    this.props.onChange(date);
  };

  toggleStartOpen = open => {
    if (!open) {
      this.setState({ endOpen: true })
    }
  }
  toggleEndOpen = open => {
    this.setState({ endOpen: open });
  }
  disabledStartDate = start => {
    if (!start || !this.state.end) {
      return false;
    }
    return start.toDate().getTime() >= this.state.end.toDate().getTime();
  }
  disabledEndDate = end => {
    if (!end || !this.state.start) {
      return false;
    }
    return end.toDate().getTime() <= this.state.start.toDate().getTime();
  }

  render() {
    const { date, start, end, endOpen, date1 } = this.state;
    return (
      <div className="rc-picker-page">
        <div className="range-picker-container">
          <RcRangePicker value={date} />
        </div>
        <div className="container">
          <div>
            <RcDatePicker
              value={start}
              onChange={d => this.onChange(d, 'start')}
              disabledDate={this.disabledStartDate}
              toggleOpen={this.toggleStartOpen}
            />
          </div>
          <span>-</span>
          <div>
            <RcDatePicker
              value={end}
              onChange={d => this.onChange(d, 'end')}
              disabledDate={this.disabledEndDate}
              open={endOpen}
              toggleOpen={this.toggleEndOpen}
            />
          </div>
        </div>
        <div>
          <DatePicker defaultValue={date1} onChange={d => console.log(d)} />
        </div>
        <div>
          <CustomRcDatePicker />
        </div>
        <div>
          <Trigger
            action={['click']}
            popupAlign={{ ...placementAlignMap.bottomLeft, offset: [10, 3] }}
            popup={<strong>trigger</strong>}
          >
            <div className="target">click</div>
          </Trigger>
        </div>
      </div>
    )
  }
}

RcDatePickerPage.defaultProps = {
  onChange: noop,
}

RcDatePickerPage.propTypes = {

}

export default RcDatePickerPage;
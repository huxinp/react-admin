import React from 'react';
import PropTypes from 'prop-types';
import Trigger from 'rc-trigger';
import ZmSelect from '../../components/ZmSelect';
import placements from './placements';
import { fromJS } from 'immutable';
import DomAlign from 'dom-align';
import Picker from 'rc-calendar/lib/Picker';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import 'rc-calendar/assets/index.css';
import 'react-datepicker/dist/react-datepicker.css';
import SelectPanel from './SelectPanel';
import moment from 'moment';

import './index.scss';

const formatStr = 'YYYY/MM/DD';

function format(v) {
  return v ? v.format(formatStr) : '';
}

function isValidRange(v) {
  return v && v[0] && v[1];
}
class ReactComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [moment().subtract(55, 'days'), moment()],
      hoverValue: []
    }
  }

  componentDidMount() {
    DomAlign(this.box2, this.box1, {
      points: ['br', 'bl'],
      overflow: {
        adjustX: 1,
        adjustY: 1
      },
      offset: [0, 0],
      targetOffset: [0, 0],
    })
  }
  disabledStartDate = (startValue) => {
    if (!startValue || !this.state.value[0]) {
      return false;
    }
    return startValue.valueOf() >= this.state.value[1].valueOf();
  }
  disabledEndDate = (endValue) => {
    if (!endValue || !this.state.value[0]) {
      return false;
    }
    return endValue.valueOf() <= this.state.value[0].valueOf();
  }
  selectHandle = (key, selected, type, close) => {
    console.log(key, selected.toJS(), type, close);
  }
  clickHandle = (e) => {
    const calendar = document.querySelector('.zm-rc-calendar');
    if (calendar && calendar.contains(e.target)) {
      if (e.target.getAttribute('aria-disabled') === 'true') {
        console.log(e.target.parentNode.getAttribute('title'));
      }
    }
  }
  onChange = value => {
    this.setState({ value });
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };
  calendarPopup = () => {
    console.log('calendarPopup')
  }
  calendarHide = () => {
    console.log('calendarHide')
  }
  onRangeCalendarPopupVisibleChange = state => {
    if (state) {
      document.addEventListener('click', this.clickHandle)
    } else {
      document.removeEventListener('click', this.clickHandle)
    }
  }
  render() {
    const { hoverValue, value: v, disabled } = this.state;
    const calendar = (
      <RangeCalendar
        className='zm-rc-calendar'
        ref={el => this.calendarCom = el}
        // hoverValue={hoverValue}
        onHoverChange={this.onHoverChange}
        showWeekNumber={false}
        dateInputPlaceholder={['开始日期', '结束日期']}
        // disabledDate={this.props.disabledDate}
        locale={zhCN}
        disabledDate={this.disabledStartDate}
        onDatePanelEnter={this.calendarPopup}
        onDatePanelLeave={this.calendarHide}
      />
    );
    const rowOptions = [], colOptions = [], defaultSelected = {
      subject: {id: null, name: '全部'},
      type: {id: null, name: '全部'},
      grade: {id: null, name: '全部'},
      year: {id: null, name: '全部'},
      difficulty: {id: null, name: '全部'},
    };
    rowOptions.push({
      name: '科目', id: 'subject',
      options: [
        {id: null, name: '全部'},
        {"id":31,"name":"数学"},
        {"id":32,"name":"语文"},
        {"id":33,"name":"奥数"},
        {"id":34,"name":"英语"}
      ]
    })
    rowOptions.push({
      name: '类型', id: 'type',
      options: [
        {id: null, name: '全部'},
        {"id":41,"name":"同步测试"},
        {"id":42,"name":"单元测试"},
        {"id":43,"name":"专题试卷"},
        {"id":44,"name":"月考试卷"},
        {"id":45,"name":"开学考试"},
        {"id":46,"name":"期中考试"},
        {"id":47,"name":"期末考试"},
        {"id":48,"name":"学考"},
      ]
    })
    colOptions.push({
      name: '年级', id: 'grade',
      options: [
        {id: null, name: '全部'},
        {"id":21,"name":"一年级"},
        {"id":22,"name":"二年级"},
        {"id":23,"name":"三年级"},
        {"id":24,"name":"四年级"},
        {"id":25,"name":"五年级"},
        {"id":26,"name":"六年级"},
        {"id":27,"name":"初一"}
      ]
    });
    colOptions.push({
      name: '年份', id: 'year',
      options: [
        {id: null, name: '全部'},
        {"id":2018,"name":"2018"},
        {"id":2017,"name":"2017"},
        {"id":2016,"name":"2016"},
        {"id":2015,"name":"2015"},
        {"id":2014,"name":"2014"},
        {"id":2013,"name":"2013"},
        {"id":2012,"name":"2012"}
      ]
    })
    colOptions.push({
      name: '难度', id: 'difficulty',
      options: [
        {id: null, name: '全部'},
        {"id":11,"name":"一级"},
        {"id":12,"name":"二级"},
        {"id":13,"name":"三级"},
        {"id":14,"name":"四级"},
        {"id":15,"name":"五级"},
        {"id":16,"name":"六级"},
        {"id":17,"name":"七级"}
      ]
    });
    return (
      <div className="react-components-page" ref={el => this.rootDiv = el}>
        React Component Page
        <div className="select-wrap">
          <ZmSelect
            rowOptions={fromJS(rowOptions)}
            colOptions={fromJS(colOptions)}
            onSelect={this.selectHandle}
          >
            {
              ({selectPath, onClick, popup}) => {
                return (
                  <div onClick={onClick}>
                    <SelectPanel popup={popup}  placeHolder="请选择" selectPath={selectPath} />
                  </div>
                )
              }
            }
          </ZmSelect>
          <Picker
            value={v}
            onChange={this.onChange}
            animation="slide-up"
            onOpenChange={this.onRangeCalendarPopupVisibleChange}
            calendar={calendar}>
            {({ value }) => {
              return (
                <div>
                  <div style={{ height: 32, position: 'relative' }}>
                    <input
                      placeholder='开始日期  ~  结束日期'
                      disabled={disabled}
                      readOnly
                      value={(isValidRange(value) && `${format(value[0])} - ${format(value[1])}`) || ''}
                    />
                  </div>
                </div>
              );
            }}
          </Picker>
          { calendar }
        </div>
        <div className="box">
          <div className="box-1" ref={el => this.box1 = el}>box 1</div>
          <div className="box-2" ref={el => this.box2 = el}>box 2</div>
        </div>
      </div>
    )
  }
}

ReactComponent.defaultProps = {

}
ReactComponent.propTypes = {

}

export default ReactComponent;
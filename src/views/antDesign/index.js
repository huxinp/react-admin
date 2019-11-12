import React, { Proptypes } from 'react';
import { Link  } from 'react-router';
import CalendarFeature from './Calendar';

import './index.less';
import Calendar from '../../components/Calendar';

const rcMap = {
  "rc-calendar": CalendarFeature,
}
const rc_list = [
  "rc-align",
  "rc-animate",
  "rc-banner-anim",
  "rc-calendar",
  "rc-cascade-select",
  "rc-checkbox",
  "rc-collapse",
  "rc-color-picker",
  "rc-dialog",
  "rc-drawer",
  "rc-dropdown",
  "rc-dropzone",
  "rc-editor-core",
  "rc-editor-mention",
  "rc-field-form",
  "rc-footer",
  "rc-form",
  "rc-form-validation",
  "rc-gesture",
  "rc-hammerjs",
  "rc-icon-anim",
  "rc-image",
  "rc-input-number",
  "rc-mentions",
  "rc-menu",
  "rc-notification",
  "rc-pager",
  "rc-pagination",
  "rc-progress",
  "rc-queue-anim",
  "rc-radio",
  "rc-rate",
  "rc-record",
  "rc-scroll-anim",
  "rc-select",
  "rc-server",
  "rc-slider",
  "rc-spider",
  "rc-steps",
  "rc-swipeout",
  "rc-switch",
  "rc-table",
  "rc-tabs",
  "rc-texty",
  "rc-time-picker",
  "rc-tooltip",
  "rc-touchable",
  "rc-tree",
  "rc-tree-select",
  "rc-trigger",
  "rc-tween-one",
  "rc-upload",
  "rc-util",
  "rc-virtual-list"
]
export default class antDesign extends React.PureComponent {
  componentDidMount() {
    
  }
  render() {
    return (
      <div className="ant-design">
        <div className="catalog-list">
        {/* { rc_list.map(item => <Link key={item} to={'/antDesign/' + item}>{item}</Link>) } */}
        </div>
        <div className="rc-containers">
          <CalendarFeature />
        </div>
      </div>
    )
  }
}
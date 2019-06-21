import React from 'react';
import PropTypes from 'prop-types';
import { Radio, Checkbox, CheckboxAll } from '../../components/Checkbox';

import Collapse from '../../components/Collapse';

import './index.scss';

import { data1, data2, data3 } from './data';
data1.map(item => {
  item.label = item.name;
  item.value = item.id;
  item.children.map(ite => {
    ite.label = ite.name;
    ite.value = ite.id;
    ite.children && ite.children.map(it => {
      it.label = it.name;
      it.value = it.id;
      it.children && it.children.map(i => {
        i.label = i.name;
        i.value = i.id;
        return i;
      })
      return it;
    })
    return ite;
  })
  return item;
})

export default class Choose extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openIds: [],
    }
  }
  openPanel = item => {
    const openIds = [...this.state.openIds];
    const index = openIds.indexOf(item.id);
    if (index < 0) {
      openIds.push(item.id)
    } else {
      openIds.splice(index, 1);
    }
    this.setState({openIds})
  }
  makePanel = item => {
    return (
      <div className="panel">
        <Checkbox>{item.name}</Checkbox>
        <span onClick={() => this.openPanel(item)}>开关</span>
      </div>
    )
  }
  makeCheckboxGroup = () => {
    const options = [];
    data1.map(it => options.push({
      value: it.id,
      label: it.name,
    }))
    return (
      <Checkbox.Group options={options} name="radio-group" onChange={this.changeHandle} />
    )
  }
  makeSemester = () => {
    const { openIds } = this.state;
    return (
      <Collapse.Group className="semester">
        {
          data1.map(it => {
            const open = openIds.includes(it.id);
            return (
              <Collapse
                className="well"
                key={it.id}
                open={open}
                panel={this.makePanel(it)}
                content={this.makeSubCollapse(it.children)}
              />
          )})
        }
      </Collapse.Group>
    )
  }
  makeSubCollapse = children => { // 这里是最小的折叠
    const { openIds } = this.state;
    return (
      <Collapse.Group className="sub-collapse">
        { children.map(it => {
            const open = openIds.includes(it.id);
            return (
              <Collapse
                key={it.id}
                open={open}
                panel={this.makePanel(it)}
                content={this.makeContentLevel(it.children)}
              />
            )
          })
        }
      </Collapse.Group>
    )
  }
  makeContentLevel = children => { // 代数, 几何 等    这里没有折叠
    return (
      <Checkbox.Group className="three-level">
        { children.map(it => {
            return (
              <div key={it.id} className="last-level">
                <Checkbox value={it.id} onChange={this.changeHandle}>{it.name}</Checkbox>
                <Checkbox.Group name={it.id}>
                  { it.children.map(item => <Checkbox className="four-level" key={item.id} value={item.id}>{item.name}</Checkbox>) }
                </Checkbox.Group>
              </div>
            )
          })
        }
      </Checkbox.Group>
    )
  }
  changeHandle = (e, data) => {
    console.log('choose', data)
  }
  render () {
    return (
      <div className="choose-wraper">
        <CheckboxAll className="check-all-group" onChange={this.changeHandle} options={data2} />
        <div style={{height: '100px'}}></div>
        {/* <CheckboxAll className="check-all-group" onChange={this.changeHandle} options={data3} /> */}
        <div style={{height: '100px'}}></div>
        <CheckboxAll className="check-all-group" onChange={this.changeHandle} options={data1} />
      </div>
    )
  }
}
Choose.defaultProps = {

}
Choose.propTypes = {
  
}
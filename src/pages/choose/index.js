import React from 'react';
import PropTypes from 'prop-types';
import { Radio, Checkbox, CheckboxAll } from '../../components/Checkbox';

import Collapse from '../../components/Collapse';

import './index.scss';

import data from './data';
data.map(item => {
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
    data.map(it => options.push({
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
          data.map(it => {
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
    console.log('choose', 'e', e, 'data', data)
    // 每次有变更之后, 都需要计算一下, 找到其父节点, 更改父节点的状态,  改变了父节点的状态后也要计算更改祖先节点的状态,
    // 每次父组件(全选/全不选)更改之后, 也要计算子节点的状态
  }
  render () {
    const data = [
      {
        label: 'a',
        value: 'a',
        children: [
          {
            label: 'aa',
            value: 'aa',
            children: [
              {
                label: 'aaa',
                value: 'aaa',
              },
              {
                label: 'aab',
                value: 'aab',
              },
            ]
          },
          {
            label: 'ab',
            value: 'ab',
          },
        ]
      },
      // {
      //   label: 'b',
      //   value: 'b',
      //   children: [
      //     {
      //       label: 'ba',
      //       value: 'ba',
      //     },
      //     {
      //       label: 'bb',
      //       value: 'bb',
      //     },
      //   ]
      // }
    ]
    return (
      <div className="choose-wraper">
        {/* { this.makeSemester() }
        <div className="one">
          <Checkbox onChange={this.changeHandle} indeterminate={true} readOnly={true}>123</Checkbox>
        </div>
        <Radio className='radio' onChange={this.changeHandle} disabled={true} checked={true}>456</Radio>
        { this.makeCheckboxGroup() }
        <CheckboxAll name="all" label="All" onChange={this.changeHandle} options={data} /> */}
        {
          data.map(item => {
            return (
              <div className="well" key={item.value}>
                <CheckboxAll className="check-all-group" onChange={this.changeHandle} options={item} />
              </div>
            )
          })
        }
      </div>
    )
  }
}
Choose.defaultProps = {

}
Choose.propTypes = {
  
}
import React from 'react';

export function Cell (props) {
  return <div className="custom-cell">{props.title}</div>
}
export function Header (props) {
  return (
    <header>
      <span className={`${props.disabled.prev ? 'disabled' : ''}`} onClick={props.prev}><Cell title={'<'} /></span>
      <span onClick={props.middleUp}>{props.title}</span>
      <span className={`${props.disabled.next ? 'disabled' : ''}`} onClick={props.next}><Cell title={'>'} /></span>
    </header>
  )
}
export function HeaderCell(props) {
  return <div className="custom-header-cell">{props.title}</div>
}
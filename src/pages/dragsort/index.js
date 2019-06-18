import React from 'react';
import DragSort from '../../components/DragSort';
import './index.scss';

export default class DragSortPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      move1: [
        { label: "A" },
        { label: "B" },
        { label: "C" },
        { label: "D" },
        { label: "E" },
        { label: "F" },
        { label: "G" },
        { label: "H" },
        { label: "I" },
        { label: "J" },
        { label: "K" },
        { label: "L" },
        { label: "M" },
        { label: "N" },
      ],
      move2: [
        { label: "A" },
        { label: "B" },
        { label: "C" },
        { label: "D" },
        { label: "E" },
        { label: "F" },
        { label: "G" },
        // { label: "H" },
        // { label: "I" },
        // { label: "J" },
        // { label: "K" },
        // { label: "L" },
        // { label: "M" },
        // { label: "N" },
      ],
    }
  }
  dragSort = (list, type) => this.setState({ [type]: list });
  render() {
    const { move1, move2 } = this.state;
    return (
      <div className="page-wrap">
        <DragSort list={move1} onSorted={list => this.dragSort(list, 'move1')} />
        <DragSort list={move2} onSorted={list => this.dragSort(list, 'move2')} />
      </div>
    )
  }
}


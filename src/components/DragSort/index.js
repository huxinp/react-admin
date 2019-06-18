import React from 'react';
import './index.scss';

export default class DragSortPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      move: this.props.list,
      moveLabel: this.props.list.map(item => item.label),
      draggable: false,
    }
    this.dragState = false;
    this.dropOver = [];
    this.overState = true; // 位置  true: 插在后面, false: 插在前面
    this.cardHeight = 0;
    this.scrollTimer = null;
    this.scrollState = ''; 
  }
  componentDidMount() {
    this.dragWrap.addEventListener('dragleave', this.dragLeave);
    this.dragWrap.addEventListener('dragstart', this.dragStart);
    this.dragWrap.addEventListener('dragend', this.dragEnd);
    this.dragWrap.addEventListener('dragover', this.dragOver);
    this.dragWrap.addEventListener('mouseenter', this.enterHandle);
    this.dragWrap.addEventListener('mouseleave', this.leaveHandle);
  }
  componentWillUnmount() {
    this.dragWrap.removeEventListener('dragleave', this.dragLeave);
    this.dragWrap.removeEventListener('dragstart', this.dragStart);
    this.dragWrap.removeEventListener('dragend', this.dragEnd);
    this.dragWrap.removeEventListener('dragover', this.dragOver);
    this.dragWrap.removeEventListener('mouseenter', this.enterHandle);
    this.dragWrap.removeEventListener('mouseleave', this.leaveHandle);
    this.dragWrap = null;
    clearInterval(this.scrollTimer);
    this.scrollTimer = null;
  }
  dragStart = e=> {
    this.dropOver = [];
    this.cardHeight = e.target.offsetHeight;
    this.bindDraged(e.target)
    // console.table({
    //   screenY: e.screenY,
    //   y: e.y,
    //   clientY: e.clientY,
    //   offsetY: e.offsetY,
    //   layerY: e.layerY,
    //   pageY: e.pageY,
    //   label: this.getLabel(e),
    // })
  }
  dragEnd = e => {
    e.preventDefault();
    if (!this.dragWrap.contains(this.draged)) return;
    this.scrollTo('stop');
    const moveLabel = [...this.state.moveLabel]
    const move = [...this.state.move]
    const overed = move.find(item => item.label === this.dropOver[0]);
    const moved = move.find(item => item.label === this.getLabel(e))
    if (!overed || !moved) return;
    if (overed.label === moved.label) return;
    // 删除拖拽的数据
    const dragedIndex = moveLabel.indexOf(moved.label);
    move.splice(dragedIndex, 1);
    moveLabel.splice(dragedIndex, 1);
    // 插入 拖拽的数据
    let dropedIndex = moveLabel.indexOf(overed.label);
    if (this.overState) { // 如果插在该数据后面
      dropedIndex++;
    }
    move.splice(dropedIndex, 0, moved);
    moveLabel.splice(dropedIndex, 0, moved.label);
    this.setState({
      move, moveLabel,
    })
    this.bindDraged()
  }
  dragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    if (!this.dragWrap.contains(this.draged)) return;
    if (e.target === this.topHover || e.target === this.bottomHover) {
      this.scrollTo('stop');
    }
  }
  dragOver = e => {
    e.preventDefault();
    if (!this.dragWrap.contains(this.draged)) return;
    if (e.target.className === 'card') {
      this.dropOver[0] = this.getLabel(e);
      if (this.overState !== (e.offsetY >= this.cardHeight / 2)) {
        this.overState = e.offsetY >= this.cardHeight / 2;
      }
    }
    if (e.target === this.topHover) {
      this.scrollTo('top');
    }
    if (e.target === this.bottomHover) {
      this.scrollTo('bottom');
    }
  }
  enterHandle = e => {
    e.preventDefault();
    // e.stopPropagation();
    if (!this.dragWrap.contains(e.target)) return;
    if (e.target.className === 'drag-handle') {
      this.setState({ draggable: true })
    }
  }
  leaveHandle = e => {
    e.preventDefault();
    e.stopPropagation();
    if (!this.dragWrap.contains(e.target)) return;
    if (e.target.className === 'drag-handle') {
      this.setState({ draggable: false })
    }
  }
  getLabel = e => {
    return e.target.getAttribute('label');
  }
  bindDraged = (el = null) => {
    // 记录 drag 目标, 用于判断只在此组内事件生效
    this.draged = el;
  }
  scrollTo = state => {
    // 重复状态不再重新开始定时器
    if (this.scrollState === state && this.scrollTimer) return;
    let step = 0;
    switch (state) {
      case 'top':    // 向顶部滚动
        step = -50;
        break;
      case 'bottom': // 向底部滚动
        step = 50;
        break;
      default:       // 'stop'  不滚动
        clearInterval(this.scrollTimer);
        this.scrollTimer = null;
        return
    }
    const dragList = this.dragList;
    this.scrollState = state; // 缓存滚动类型
    if (state === 'bottom' && dragList.offsetHeight + dragList.scrollTop >= dragList.scrollHeight) return // 已经是底部了
    if (state === 'top' && dragList.scrollTop <= 0) return // 已经是顶部了
    this.scrollTimer = setInterval(() => {
      dragList.scrollTop += step;
      if (state === 'top' && dragList.scrollTop <= 0) {
        // 已滚动到顶部
        console.log('到顶了')
        clearInterval(this.scrollTimer);
        this.scrollTimer = null;
      }
      if (state === 'bottom' && dragList.offsetHeight + dragList.scrollTop >= dragList.scrollHeight) {
        // 已滚动到底部
        console.log('到底了')
        clearInterval(this.scrollTimer);
        this.scrollTimer = null;
      }
    }, 100)
  }
  render() {
    const { draggable, move } = this.state;
    return (
      <div className="drag-wrap" ref={el => this.dragWrap = el}>
        <div className="top-hover hover-handle" ref={el => this.topHover = el}></div>
        <div className="drag-list" ref={el => this.dragList = el}>
          {
            move.map(m => (
              <div
                className="card"
                draggable={draggable}
                key={m.label}
                label={m.label}
              >
                {m.label}
                <div className="drag-handle" onMouseEnter={this.enterHandle} onMouseLeave={this.leaveHandle}>icon</div>
              </div>
            ))
          }
        </div>
        <div className="bottom-hover hover-handle" ref={el => this.bottomHover = el}></div>
      </div>
    )
  }
}


import React, { PropTypes } from 'react';
import './index.scss';

export default class SelectPanel extends React.PureComponent {
  render() {
    const { selectPath = {}, onClick, placeHolder, prefixCls, open } = this.props;
    return (
      <div className={`${prefixCls}-input`} onClick={onClick}>
        <div className="ellipsis" title={selectPath.titlePath || placeHolder}>{selectPath.textPath || placeHolder}</div>
        <span className={`arrow ${open ? 'fire' : ''}`}></span>
        <input placeholder={placeHolder} type="text" readOnly />
      </div>
    )
  }
}
SelectPanel.defaultProps = {
  placeHolder: '请选择...',
  onClick: function() {
    console.warn(`component SelectPanel fired default props func: onClick()`)
  },
  open: false,
}
SelectPanel.propTypes = {
  placeHolder: PropTypes.string,
  selectPath: PropTypes.object,
  onClick: PropTypes.func,
  prefixCls: PropTypes.string,
  open: PropTypes.bool,
}
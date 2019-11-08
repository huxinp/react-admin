import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

export default class SelectPanel extends React.PureComponent {
  state = {

  }

  render() {
    const { selectPath, onClick, placeHolder, prefixCls, popup } = this.props;
    return (
      <div className={`${prefixCls}-panel`} onClick={onClick}>
        <div>
          <div className="ellipsis" title={selectPath.titlePath || placeHolder}>{selectPath.textPath || placeHolder}</div>
          <span className={`arrow ${popup ? 'fire' : ''}`}></span>
        </div>
        <input title={selectPath.titlePath || placeHolder} placeholder={placeHolder} value={selectPath.textPath} type="text" readOnly />
      </div>
    )
  }
}
SelectPanel.defaultProps = {
  placeHolder: '请选择...',
  onClick: function() {
    console.warn(`component SelectPanel fired default props func: onClick()`)
  },
  popup: false,
  prefixCls: 'zm-select'
}
SelectPanel.propTypes = {
  placeHolder: PropTypes.string,
  selectPath: PropTypes.object,
  onClick: PropTypes.func,
  prefixCls: PropTypes.string,
  popup: PropTypes.bool,
}
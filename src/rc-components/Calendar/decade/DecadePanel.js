import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const ROW = 4;
const COL = 3;

function goYear(direction) {
  const next = this.state.value.clone();
  next.add(direction, 'year');
  this.setState({ value: next });
}

function chooseDecade(year, event) {
  const next = this.state.value.clone();
  next.year(year);
  next.month(this.state.value.month());
  this.props.onSelect(next);
  event.preventDefault();
}

export default class DecadePanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue,
    }
    this.prefixCls = props.rootPrefixCls + '-decade-panel';
    this.nextCentury = goYear.bind(this, 100);
    this.previousCentury = goYear.bind(this, -100);
  }
  render() {
    const { locale } = this.props;
    const { value } = this.state;
    const currentYear = value.year();
    const startYear = parseInt(currentYear / 100, 10) * 100;
    const preYear = startYear - 10;
    const endYear = startYear + 99;
    const decades = [];
    let index = 0;
    const prefixCls = this.prefixCls;
    for (let rowIndex = 0; rowIndex < ROW; rowIndex++) {
      decades[rowIndex] = [];
      for (let colIndex = 0; colIndex < COL; colIndex++) {
        const startDecade = preYear + index * 10;
        const endDecade = preYear + index * 10 + 9;
        decades[rowIndex][colIndex] = {
          startDecade, endDecade,
        };
        index++;
      }
    }
    const decadesEls = decades.map(function(row, decadeIndex) {
      const tds = row.map(function(decadeData) {
        const { startDecade, endDecade } = decadeData;
        const isLast = startDecade < startYear;
        const isNext = endDecade > endYear;
        const className = classnames(prefixCls + '-cell', {
          [prefixCls + '-selected-cell']: startDecade <= currentYear && currentYear <= endDecade,
          [prefixCls + '-last-century-cell']: isLast,
          [prefixCls + '-next-century-cell']: isNext,
        });
        const content = startDecade + '-' + endDecade;
        let clickHandler = void 0;
        if (isLast) {
          clickHandler = this.previousCentury;
        } else if (isNext) {
          clickHandler = this.nextCentury;
        } else {
          clickHandler = chooseDecade.bind(this, startDecade);
        }
        return React.createElement(
          'td',
          {
            key: startDecade,
            onClick: clickHandler,
            role: 'gridcell',
            className,
          },
          React.createElement(
            'a',
            { className: prefixCls + '-decade' },
            content
          )
        )
      }.bind(this))
      return React.createElement(
        'tr',
        { key: decadeIndex, role: 'row' },
        tds
      );
    }.bind(this))
    return React.createElement(
      'div',
      { className: this.prefixCls },
      React.createElement(
        'div',
        { className: prefixCls + '-header' },
        React.createElement('a', {
          className: prefixCls + '-prev-century-btn',
          role: 'button',
          onClick: this.previousCentury,
          title: locale.previousCentury,
        }),
        React.createElement(
          'div',
          { className: prefixCls + '-century' },
          startYear,
          '-',
          endYear
        ),
        React.createElement('a', {
          className: prefixCls + '-next-century-btn',
          role: 'button',
          onClick: this.nextCentury,
          title: locale.nextCentury,
        })
      ),
      React.createElement(
        'div',
        { className: prefixCls + '-body' },
        React.createElement(
          'table',
          { className: prefixCls + '-table', cellSpacing: '0', role: 'grid' },
          React.createElement(
            'tbody',
            { className: prefixCls + '-tbody' },
            decadesEls
          )
        )
      )
    )
  }
}

DecadePanel.propTypes = {
  locale: PropTypes.object,
  value: PropTypes.object,
  defaultValue: PropTypes.object,
  rootPrefixCls: PropTypes.string
}
DecadePanel.defaultProps = {
  onSelect: function onSelect() {}
}
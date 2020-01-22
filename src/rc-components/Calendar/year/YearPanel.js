import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import DecadePanel from '../decade/DecadePanel';

const ROW = 4;
const COL = 3;

function goYear(direction) {
  const value = this.state.value.clone();
  value.add(direction, 'year');
  this.setState({ value });
}

function chooseYear(year) {
  const value = this.state.value.clone();
  value.year(year);
  value.month(this.state.value.mont());
  this.props.onSelect(value);
}

export default class YearPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || props.defaultValue,
    }
    this.nextDecade = goYear.bind(this, 10);
    this.previousDecade = goYear.bind(this, -10);
    this.prefixCls = props.rootPrefixCls + '-year-panel';
    this.showDecadePanel = this.showDecadePanel.bind(this);
    this.onDecadePanelSelect = this.onDecadePanelSelect.bind(this);
    this.years = this.years.bind(this);
  }
  onDecadePanelSelect(current) {
    this.setState({
      value: current,
      showDecadePanel: 0
    })
  }
  years() {
    const { value } = this.state.value;
    const currentYear = value.year();
    const startYear = parseInt(currentYear / 10, 10) * 10;
    const previousYear = startYear - 1;
    const years = [];
    let index = 0;
    for (let rowIndex = 0; rowIndex < ROW; rowIndex++) {
      years[rowIndex] = [];
      for (let colIndex = 0; colIndex < COL; colIndex++) {
        const year = previousYear + index;
        const content = String(year);
        years[rowIndex][colIndex] = {
          content,
          year,
          title: content,
        }
        index++;
      }
    }
    return years;
  }
  showDecadePanel() {
    this.setState({ showDecadePanel: 1 })
  }
  render() {
    const { value, showDecadePanel } = this.state;
    const { locale, rootPrefixCls } = this.props;
    const years = this.years();
    const currentYear = value.year();
    const startYear = parseInt(currentYear / 10, 10) * 10;
    const endYear = startYear + 9;
    const prefixCls = this.prefixCls;
    const yeasEls = years.map(function(row, index) {
      const tds = row.map(function(yearData) {
        const className = classnames(prefixCls + '-cell', {
          [prefixCls + '-selected-cell']: yearData.year === currentYear,
          [prefixCls + '-last-decade-cell']: yearData.year < startYear,
          [prefixCls + '-next-decade-cell']: yearData.year > endYear,
        })
        let clickHandler = void 0;
        if (yearData.year < startYear) {
          clickHandler = this.previousDecade;
        } else if (yearData.year > endYear) {
          clickHandler = this.nextDecade;
        } else {
          clickHandler = chooseYear.bind(this, yearData.year);
        }
        return React.createElement(
          'td',
          {
            role: 'gridcell',
            title: yearData.title,
            key: yearData.content,
            onClick: clickHandler,
            className,
          },
          React.createElement(
            'a',
            { className: prefixCls + '-year' },
            yearData.content
          )
        )
      }.bind(this))
      return React.createElement(
        'tr',
        { key: index, role: 'row' },
        tds
      )
    }.bind(this))
    let decadePanel = void 0;
    if (showDecadePanel) {
      decadePanel = React.createElement(DecadePanel, {
        locale,
        value,
        rootPrefixCls,
        onSelect: this.onDecadePanelSelect,
      })
    }
    return React.createElement(
      'div',
      { className: this.prefixCls },
      React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: prefixCls + '-header' },
          React.createElement('a', {
            className: prefixCls + '-prev-decade-btn',
            role: 'button',
            onClick: this.previousDecade,
            title: locale.previousDecade,
          }),
          React.createElement(
            'a',
            {
              className: prefixCls + '-decade-select',
              role: 'button',
              onClick: this.showDecadePanel,
              title: locale.decadeSelect
            },
            React.createElement(
              'span',
              { className: prefixCls + '-decade-select-content' },
              startYear,
              '-',
              endYear,
            ),
            React.createElement(
              'span',
              { className: prefixCls + '-decade-select-arrow' },
              'x'
            )
          ),
          React.createElement('a', {
            className: prefixCls + '-next-decade-btn',
            role: 'button',
            onClick: this.nextDecade,
            title: locale.nextDecade,
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
              yeasEls,
            )
          )
        )
      ),
      decadePanel,
    )
  }
}

YearPanel.propTypes = {
  rootPrefixCls: PropTypes.string,
  value: PropTypes.object,
  defaultValue: PropTypes.object,
};
YearPanel.defaultProps = {
  onSelect: function onSelect() {}
}
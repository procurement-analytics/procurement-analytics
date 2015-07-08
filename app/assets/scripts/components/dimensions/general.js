'use strict';
var Reflux = require('reflux');
var React = require('react/addons');
var d3 = require('d3');
var _ = require('lodash');
var numeral = require('numeral');
var LineChart = require('../charts/line_chart');
var utils = require('../../utils/utils');

var IndGeneral = module.exports = React.createClass({

  propTypes: {
    data: React.PropTypes.object,
    x: React.PropTypes.object,
    y: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      generalStats: []
    };
  },

  chartPopover: function(d, i, otherData) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Set', 'Oct', 'Nov', 'Dec'];
    // Get the charts we want from the data.
    var variation = 'N/A';
    if (i > 0) {
      var a = otherData.full[i - 1].value;
      var b = otherData.full[i].value;
      var min = _.min([a, b]);
      var max = _.max([a, b]);

      if (min > 0 && max > 0) {
        var variation = max / min * 100;
        // Count only the difference between the values.
        variation -= 100;
        // Check whether is increasing or decreasing.
        variation *= b < a ? -1 : 1;
        variation = Math.round(variation * 100) / 100;
        variation += '%';
      }
    }

    var value = utils.formatToMillion(d.value);

    return (
      <dl className="popover-list">
        <dt>Value</dt>
        <dd>{value}</dd>
        <dt>Date</dt>
        <dd>{months[d.date.getMonth()]} {d.date.getFullYear()}</dd>
        <dt>Variation</dt>
        <dd>{variation}</dd>
      </dl>
    );
  },

  componentDidMount: function() {
    d3.json('data/general.json', function(error, json) {
      if (error) {
        return;
      }
      this.setState({generalStats: json});
    }.bind(this));
  },

  render: function() {
    var ldn = this.props.loading;

    // Get the charts we want from the data
    var chartData = this.props.data.charts || [];
    var amountChartData = _.find(chartData, {id: 'amount-time'});
    var contractsChartData = _.find(chartData, {id: 'contracts-time'});

    var contractsCharts, amountCharts;

    // Check how many "mini-charts" we need to build for each chart.
    // Because these charts are of the type that spawn "mini-charts".

    // Chart contracts over time
    if (contractsChartData) {
      contractsCharts = contractsChartData.data.map(function(o, i) {
        return (
          <div className="chart-item" key={i.toString()}>
            <h2 className="chart-title">{o.label}</h2>
            <LineChart data={o.data} x={_.omit(contractsChartData.x, 'label')}  y={_.omit(contractsChartData.y, 'label')} popoverContentFn={this.chartPopover} />
          </div>
        );
      }.bind(this));
    }

    // Chart amount over time
    if (amountChartData) {
      amountCharts = amountChartData.data.map(function(o, i) {
        return (
          <div className="chart-item" key={i.toString()}>
            <h2 className="chart-title">{o.label}</h2>
            <LineChart data={o.data} x={_.omit(amountChartData.x, 'label')}  y={_.omit(amountChartData.y, 'label')} popoverContentFn={this.chartPopover} />
          </div>
        );
      }.bind(this));
    }

    // Build the tile for this contractsCharts.
    var contractsTile = (
      <section className={"tile chart-group" + (ldn ? ' loading' : '') + utils.chartGroupClass(contractsCharts)}>
        <h1 className="tile-title">{ldn ? 'Loading' : contractsChartData.title}</h1>
        {contractsCharts ? (
          <div className="tile-body">
            <div className="tile-prose">
              <p>The number of contracts in the dataset over time, optionally broken down by size of supplier and contract procedure.</p>
            </div>
            <div className="chart-container">
              {contractsCharts}
            </div>
          </div>
        ) : null}
      </section>
    );

    // Build the tile for this amountCharts.
    var amountTile = (
      <section className={"tile chart-group" + (ldn ? ' loading' : '') + utils.chartGroupClass(amountCharts)}>
        <h1 className="tile-title">{ldn ? 'Loading' : amountChartData.title}</h1>
        {amountCharts ? (
          <div className="tile-body">
            <div className="tile-prose">
              <p>The value of the contracts in the dataset, optionally broken down by size of supplier and contract procedure.</p>
            </div>
            <div className="chart-container">
              {amountCharts}
            </div>
          </div>
        ) : null}
      </section>
    );

    var generalStats = this.state.generalStats.length == 0 ? null : (
      <dl className="facts-list">
        {this.state.generalStats.map(function(d) {
          return [(<dt>{d.label}</dt>), (<dd>{d.value}</dd>)];
        })}
      </dl>
    );

    return (
      <div className="content">

        <div className="col-intro">
          <section className="tile">
            <h1 className="tile-title">Summary</h1>
            <div className="tile-body">
              <p>Here you can see summary information about the full dataset.</p>
              {generalStats}
            </div>
          </section>
        </div>

        <div className="col-main">
          {contractsTile}
          {amountTile}
        </div>

      </div>
    );
  }
});

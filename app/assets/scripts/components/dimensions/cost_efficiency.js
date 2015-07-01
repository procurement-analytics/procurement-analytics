'use strict';
var React = require('react/addons');
var Reflux = require('reflux');
var _ = require('lodash');
var numeral = require('numeral');
var utils = require('../../utils/utils');

var BoxChart = require('../charts/box_chart');
var BarChart = require('../charts/bar_chart');

var IndCostEfficiency = module.exports = React.createClass({

  propTypes: {
    data: React.PropTypes.object,
  },

  distributionChartPopover : function(d, i, otherData) {
    var buckets = otherData.buckets;
    return (
      <dl className="popover-list">
        <dt>Contracts</dt>
        <dd>{d[0]}</dd>
        <dt>Price bucket</dt>
        <dd>{buckets[i]} - {buckets[i + 1]}</dd>
      </dl>
    );
  },

  variationChartPopover : function(d) {
    return (
      <dl className="popover-list">
        <dt>Min</dt>
        <dd>{numeral(d.whisker1).format('0,0[.]0')}</dd>
        <dt>1st Quartile</dt>
        <dd>{numeral(d.q1).format('0,0[.]0')}</dd>
        <dt>Median</dt>
        <dd>{numeral(d.median).format('0,0[.]0')}</dd>
        <dt>3rd Quartile</dt>
        <dd>{numeral(d.q3).format('0,0[.]0')}</dd>
        <dt>Max</dt>
        <dd>{numeral(d.whisker2).format('0,0[.]0')}</dd>
      </dl>
    );
  },

  render: function() {

    var ldn = this.props.loading;

    var chartData = this.props.data.charts || [];
    var distributionChartData = _.find(chartData, {id: 'price-distribution'});
    var variationChartData = _.find(chartData, {id: 'price-variation'});

    var distributionCharts, variationCharts;

    if (distributionChartData) {
      distributionCharts = distributionChartData.data.map(function(o, i) {
        return (
          <div className="chart-item" key={i.toString()}>
            <h2 className="chart-title">{o.label}</h2>
            <BarChart data={o.data} x={distributionChartData.x}  y={distributionChartData.y} popoverContentFn={this.distributionChartPopover}/>
          </div>
        );
      }.bind(this));
    }

    if (variationChartData) {
      variationCharts = (
        <div className="chart-item">
          <BoxChart data={variationChartData.data} x={_.omit(variationChartData.x, 'label')} popoverContentFn={this.variationChartPopover}/>
        </div>
      );
    }

    var distributionTile = (
      <section className={"tile chart-group" + (ldn ? ' loading' : '') + utils.chartGroupClass(distributionCharts)}>
        <h1 className="tile-title">Price distribution</h1>
        {distributionCharts ? (
          <div className="tile-body">
            <div className="tile-prose">
              <p>The distribution of prices of contracts in the dataset, grouped into price buckets.</p>
            </div>
            <div className="chart-container">
              {distributionCharts}
            </div>
          </div>
        ) : null}
      </section>
    );

    var variationTile = (
      <section className={"tile chart-group chart-group-none" + (ldn ? ' loading' : '')}>
        <h1 className="tile-title">Price variation</h1>
        {variationCharts ? (
          <div className="tile-body">
            <div className="tile-prose">
              <p>The variation in prices in the dataset. The width of the box shows the range of prices, and the vertical line in the middle shows the average.</p>
            </div>
            <div className="chart-container">
              {variationCharts}
            </div>
          </div>
        ) : null}
      </section>
    );

    return (
      <div className="content">

        <div className="col-intro">
          <section className="tile">
            <h1 className="tile-title">About cost efficiency</h1>
            <div className="tile-body">
              <p>Paying the most economical price is a fundamental goal of any purchasing decision, whether on our private lives, corporate work or on government operations.</p>
            </div>
          </section>
        </div>

        <div className="col-main">
          {distributionTile}
          {variationTile}
        </div>
        
      </div>
    );
  }
});

'use strict';
var React = require('react/addons');
var Reflux = require('reflux');
var _ = require('lodash');

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
        <dd>{d.whisker1}</dd>
        <dt>1st Quartile</dt>
        <dd>{d.q1}</dd>
        <dt>Median</dt>
        <dd>{d.median}</dd>
        <dt>3rd Quartile</dt>
        <dd>{d.q3}</dd>
        <dt>Max</dt>
        <dd>{d.whisker2}</dd>
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
      <section className={"tile chart-group" + (ldn ? ' loading' : '') + (distributionCharts ? ' chart-group-' + distributionCharts.length : '')}>
        <h1 className="tile-title">Price distribution</h1>
        {distributionCharts ? (
          <div className="tile-body">
            <div className="tile-prose">
              <p>Vivamus nec sem sed libero placerat fermentum. Sed eget sem vel risus molestie ultricies massa feugiat.</p>
            </div>
            {distributionCharts}
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
              <p>Vivamus nec sem sed libero placerat fermentum. Sed eget sem vel risus molestie ultricies massa feugiat.</p>
            </div>
            {variationCharts}
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

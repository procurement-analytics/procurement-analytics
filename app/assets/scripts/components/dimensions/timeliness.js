'use strict';
var Reflux = require('reflux');
var React = require('react/addons');
var _ = require('lodash');
var TimeChart = require('../charts/timechart');

var IndTimeliness = module.exports = React.createClass({

  propTypes: {
    data: React.PropTypes.object
  },

  chartPopover: function(d, i, otherData) {
    return (
      <dl className="popover-list">
        <dt>{otherData.bands[0]}</dt>
        <dd>{d.data[0]} days</dd>
        <dt>{otherData.bands[1]}</dt>
        <dd>{d.data[1]} days</dd>
        <dt>{otherData.bands[2]}</dt>
        <dd>{d.data[2]} days</dd>
      </dl>
    );
  },

  render: function() {
    var ldn = this.props.loading;

    var chartData = this.props.data.charts || [];
    var timeChartData = _.find(chartData, {id: 'average-timeline'});
    var timeCharts;

    if (timeChartData) {
      timeCharts = (
        <div className="chart-item">
          <TimeChart data={timeChartData.data} x={timeChartData.x}  y={timeChartData.y} popoverContentFn={this.chartPopover} />
        </div>
      );
    }

    var timeTile = (
      <section className={"tile chart-group chart-group-none" + (ldn ? ' loading' : '')}>
        <h1 className="tile-title">{ldn ? 'Loading' : timeChartData.title}</h1>
        {timeCharts ? (
          <div className="tile-body">
            <div className="tile-prose">
              <p>Vivamus nec sem sed libero placerat fermentum. Sed eget sem vel risus molestie ultricies massa feugiat.</p>
            </div>
            {timeCharts}
          </div>
        ) : null}
      </section>
    );

    return (
      <div className="content">

        <div className="col-intro">
          <section className="tile">
            <h1 className="tile-title">About timeliness</h1>
            <div className="tile-body">
              <p>Timely delivery of goods, works and services is a key indication of success in procurement, whether done by private sector companies or governments.</p>
            </div>
          </section>
        </div>

        <div className="col-main">
          {timeTile}
        </div>

      </div>
    );
  }
});

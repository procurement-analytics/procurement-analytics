'use strict';
var Reflux = require('reflux');
var React = require('react/addons');
var _ = require('lodash');
var TimeChart = require('../charts/timechart');

var IndTimeliness = module.exports = React.createClass({

  propTypes: {
    data: React.PropTypes.object
  },

  render: function() {


    var chartData = this.props.data.charts || [];
    var timeChartData = _.find(chartData, {id: 'average-timeline'});
    var timeCharts;

    if (timeChartData) {
      timeCharts = <div className="chart-item"><TimeChart data={timeChartData.data} x={timeChartData.x}  y={timeChartData.y} /></div>
    }

    return (
      <div className="content">
        <section className="tile intro">
          <h1 className="tile-title">Overview</h1>
          <div className="tile-body">
            <p>Timely delivery of goods, works and services is a key indication of success in procurement, whether done by private sector companies or governments.</p>
          </div>
        </section>

        <section className="tile chart-group">
          <h1 className="tile-title">Average timeline</h1>
          {timeCharts ? <div className="tile-body">{timeCharts}</div> : null}
        </section>


        <section className="tile chart-group">
          <h1 className="tile-title">Average timeline</h1>
          <div className="tile-body">
            <img src="assets/graphics/content/ch_average-timeline-gov.png"/>
          </div>
        </section>

      </div>
    );
  }
});

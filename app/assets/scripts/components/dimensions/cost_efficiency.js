'use strict';
var React = require('react/addons');
var Reflux = require('reflux');

var BoxChart = require('../charts/box_chart');
var BarChart = require('../charts/bar_chart');

var _ = require('lodash');

var boxPlot1 = {
  x: {
    min: 100,
    max: 100099,
    label: 'Data label'
  },
  plots: [
    {
      min: 100,
      max: 100099,
      whisker1: 100,
      q1: 16548,
      median: 33019,
      q3: 49566,
      whisker2: 99093
    }
  ]
};

var boxPlot2 = {
  x: {
    min: 100,
    max: 10099,
    label: 'Data label'
  },
  plots: [
    {
      min: 590,
      max: 8090,
      whisker1: 590,
      q1: 1090,
      median: 2294,
      q3: 2890,
      whisker2: 7797,
    },
    {
      min: 90,
      max: 10099,
      whisker1: 90,
      q1: 1698,
      median: 3399,
      q3: 4996,
      whisker2: 9993,
    }
  ]
};

var boxPlot3 = {
  x: {
    min: 100,
    max: 10099,
    label: 'Data label'
  },
  plots: [
    {
      min: 590,
      max: 8090,
      whisker1: 590,
      q1: 1090,
      median: 2294,
      q3: 2890,
      whisker2: 7797,
    },
    {
      min: 90,
      max: 10099,
      whisker1: 90,
      q1: 1698,
      median: 3399,
      q3: 4996,
      whisker2: 9993,
    },
    {
      min: 90,
      max: 10099,
      whisker1: 90,
      q1: 1698,
      median: 3399,
      q3: 4996,
      whisker2: 9993,
    }
  ]
};



var IndCostEfficiency = module.exports = React.createClass({

  propTypes: {
    data: React.PropTypes.object,
  },

  render: function() {

    var ldn = this.props.loading;
    if (this.props.data.metadata) {

      var chartData = this.props.data.charts;
      var distributionChartData = _.find(chartData, {id: 'price-distribution'});
      var variationChartData = _.find(chartData, {id: 'price-variation'});
      console.log(distributionChartData);

      var distributionCharts = distributionChartData.data.map(function(o, i) {
        return <div className="chart-item" key={i.toString()}><BarChart data={o.data} x={distributionChartData.x}  y={distributionChartData.y}/></div>;
      });

      var variationCharts = <div className="chart-item"><BoxChart data={variationChartData.data} x={variationChartData.x}/></div>;
    }

    var distributionTile = (
        <section className={"tile chart-group" + (ldn ? ' loading' : '')}>
          <h1 className="tile-title">Price distribution</h1>
          {this.props.data.metadata ? <div className="tile-body">{distributionCharts}</div> : null}
        </section>
    );

    var variationTile = (
        <section className={"tile chart-group" + (ldn ? ' loading' : '')}>
          <h1 className="tile-title">Price variation</h1>
          {this.props.data.metadata ? <div className="tile-body">{variationCharts}</div> : null}
        </section>
    );



    return (
      <div className="content">
        <section className="tile intro">
          <h1 className="tile-title">Overview</h1>
          <div className="tile-body">
            <p>Paying the most economical price is a fundamental goal of any purchasing decision, whether on our private lives, corporate work or on government operations.</p>
          </div>
        </section>
        {distributionTile}
        {variationTile}
      </div>
    );
  }
});

'use strict';
var Reflux = require('reflux');
var React = require('react/addons');
var _ = require('lodash');

var ScatterplotChart = require('../charts/scatterplot_chart');

var IndFairness = module.exports = React.createClass({

  propTypes: {
    data: React.PropTypes.object
  },

  relationChartPopover: function(d) {
    return (
      <div>
        Company: {d.name}<br/>
        Suppliers: {d.suppliers}<br/>
        Contracts: {d.contracts}<br/>
        Amount: {d.amount}
      </div>
    );
  },

  concentrChartPopover: function(d) {
    return (
      <div>
        Company: {d.name}<br/>
        Contracts: {d.contracts}<br/>
        Amount: {d.amount}
      </div>
    );
  },

  render: function() {
    var ldn = this.props.loading;

    var chartData = this.props.data.charts || [];
    var relationChartData = _.find(chartData, {id: 'relationship'});
    var concentrChartData = _.find(chartData, {id: 'concentration-winning'});
    var relationCharts, concentrCharts;

    if (relationChartData) {
      relationCharts = relationChartData.data.map(function(o, i) {
        return (
          <div className="chart-item" key={i.toString()}>
            <ScatterplotChart data={o.data} x={relationChartData.x} y={relationChartData.y} r={relationChartData.r} popoverContentFn={this.relationChartPopover} />
          </div>
        );
      }.bind(this));
    }

    if (concentrChartData) {
      concentrCharts = concentrChartData.data.map(function(o, i) {
        return (
          <div className="chart-item" key={i.toString()}>
            <ScatterplotChart data={o.data} x={concentrChartData.x}  y={concentrChartData.y} popoverContentFn={this.concentrChartPopover} />
          </div>
        );
      }.bind(this));
    }

    var relationTile = (
      <section className={"tile chart-group" + (ldn ? ' loading' : '')}>
        <h1 className="tile-title">{ldn ? 'Loading' : relationChartData.title}</h1>
        {relationCharts ? <div className="tile-body">{relationCharts}</div> : null}
      </section>
    );

    var concentrTile = (
      <section className={"tile chart-group" + (ldn ? ' loading' : '')}>
        <h1 className="tile-title">{ldn ? 'Loading' : concentrChartData.title}</h1>
        {concentrCharts ? <div className="tile-body">{concentrCharts}</div> : null}
      </section>
    );

    return (
      <div className="content">
        <section className="tile intro">
          <h1 className="tile-title">Overview</h1>
          <div className="tile-body">
            <p>A level playing field is a linchpin of continuous competition for government contracts, and competition is a pre-requisite for cost-efficiency and quality.</p>
          </div>
        </section>

        <section className="tile chart-group">
          <h1 className="tile-title">Top 5 contracts</h1>
          <div className="tile-body">
            <img src="assets/graphics/content/ch_top5-cont-gov.png"/>
          </div>
        </section>

        {relationTile}
        {concentrTile}

      </div>
    );
  }
});

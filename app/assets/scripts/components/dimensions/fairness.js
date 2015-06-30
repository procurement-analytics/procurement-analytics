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
        Buyer: {d.name}<br/>
        Suppliers: {d.suppliers}<br/>
        Contracts: {d.contracts}<br/>
        Amount: {d.amount}
      </div>
    );
  },

  concentrChartPopover: function(d) {
    return (
      <div>
        Buyer: {d.name}<br/>
        Contracts: {d.contracts}<br/>
        Amount: {d.amount}
      </div>
    );
  },

  render: function() {
    var ldn = this.props.loading;

    var chartData = this.props.data.charts || [];
    var relationChartData = _.find(chartData, {id: 'relationship'});
    //var concentrChartData = _.find(chartData, {id: 'concentration-winning'});
    var top5TableData = _.find(chartData, {id: 'top-contracts'});

    var relationCharts, concentrCharts, top5Table;

    if (relationChartData) {
      relationCharts = relationChartData.data.map(function(o, i) {
        return (
          <div className="chart-item" key={i.toString()}>
            <h2 className="chart-title">{o.label}</h2>
            <ScatterplotChart data={o.data} x={relationChartData.x} y={relationChartData.y} r={relationChartData.r} popoverContentFn={this.relationChartPopover} />
          </div>
        );
      }.bind(this));
    }

/*    if (concentrChartData) {
      concentrCharts = concentrChartData.data.map(function(o, i) {
        return (
          <div className="chart-item" key={i.toString()}>
            <h2 className="chart-title">{o.label}</h2>
            <ScatterplotChart data={o.data} x={concentrChartData.x}  y={concentrChartData.y} popoverContentFn={this.concentrChartPopover} />
          </div>
        );
      }.bind(this));
    }*/

    if (top5TableData) {
      top5Table = top5TableData.data.map(function(d, i) {
        return (
          <div className="chart-item" key={i.toString()}>
            <h2 className="chart-title">{d.label}</h2>
            <table>
              <thead>
                <tr>
                  {top5TableData.header.map(function(c, i) {return <th key={i.toString()}>{c}</th>;})}
                </tr>
              </thead>
              <tbody>
                {d.data.map(function(r, i) {
                  return <tr key={i.toString()}>{r.map(function(c, i) {
                    var opts = { key: i.toString() };
                    if (c.tooltip) {
                      opts['data-title'] = c.tooltip;
                    }
                    return <td {...opts}>{c.value}</td>;
                  })}</tr>;
                })}
              </tbody>
            </table>
          </div>
        );
      }.bind(this));
    }

    var relationTile = (
      <section className={"tile chart-group" + (ldn ? ' loading' : '') + (relationCharts ? ' chart-group-' + relationCharts.length : '')}>
        <h1 className="tile-title">{ldn ? 'Loading' : relationChartData.title}</h1>
        {relationCharts ? (
          <div className="tile-body">
            <div className="tile-prose">
              <p>Vivamus nec sem sed libero placerat fermentum. Sed eget sem vel risus molestie ultricies massa feugiat.</p>
            </div>
            {relationCharts}
          </div>
        ) : null}
      </section>
    );

/*    var concentrTile = (
      <section className={"tile chart-group" + (ldn ? ' loading' : '') + (concentrCharts ? ' chart-group-' + concentrCharts.length : '')}>
        <h1 className="tile-title">{ldn ? 'Loading' : concentrChartData.title}</h1>
        {concentrCharts ? (
          <div className="tile-body">
            <div className="tile-prose">
              <p>Vivamus nec sem sed libero placerat fermentum. Sed eget sem vel risus molestie ultricies massa feugiat.</p>
            </div>
            {concentrCharts}
          </div>
        ) : null}
      </section>
    );*/

    var top5Tile = (
      <section className={"tile chart-group" + (ldn ? ' loading' : '') + (top5Table ? ' chart-group-' + top5Table.length : '')}>
        <h1 className="tile-title">{ldn ? 'Loading' : top5TableData.title}</h1>
        {top5Table ? (
          <div className="tile-body">
            <div className="tile-prose">
              <p>Vivamus nec sem sed libero placerat fermentum. Sed eget sem vel risus molestie ultricies massa feugiat.</p>
            </div>
            {top5Table}
          </div>
        ) : null}
      </section>
    );

    return (
      <div className="content">

        <div className="col-intro">
          <section className="tile">
            <h1 className="tile-title">About fairness</h1>
            <div className="tile-body">
              <p>A level playing field is a linchpin of continuous competition for government contracts, and competition is a pre-requisite for cost-efficiency and quality.</p>
            </div>
          </section>
        </div>

        <div className="col-main">
          {top5Tile}
          {relationTile}
          {/*concentrTile*/}
        </div>

      </div>
    );
  }
});

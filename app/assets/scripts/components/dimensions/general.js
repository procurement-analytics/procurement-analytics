'use strict';
var Reflux = require('reflux');
var React = require('react/addons');
var _ = require('lodash');
var LineChart = require('../charts/line_chart');

var IndGeneral = module.exports = React.createClass({

  propTypes: {
    data: React.PropTypes.object,
    x: React.PropTypes.object,
    y: React.PropTypes.object
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

    ////// Chart contracts over time
    if (contractsChartData) {
      contractsCharts = contractsChartData.data.map(function(o, i) {
        return <div className="chart-item" key={i.toString()}><LineChart data={o.data} x={_.omit(contractsChartData.x, 'label')}  y={_.omit(contractsChartData.y, 'label')}/></div>;
      });
    }

    ////// Chart amount over time
    if (amountChartData) {
      amountCharts = amountChartData.data.map(function(o, i) {
        return <div className="chart-item" key={i.toString()}><LineChart data={o.data} x={_.omit(amountChartData.x, 'label')}  y={_.omit(amountChartData.y, 'label')}/></div>;
      });
    }

    // Build the tile for this contractsCharts.
    var contractsTile = (
      <section className={"tile chart-group" + (ldn ? ' loading' : '')}>
        <h1 className="tile-title">{ldn ? 'Loading' : contractsChartData.title}</h1>
        {contractsCharts ? <div className="tile-body">{contractsCharts}</div> : null}
      </section>
    );

    // Build the tile for this amountCharts.
    var amountTile = (
      <section className={"tile chart-group" + (ldn ? ' loading' : '')}>
        <h1 className="tile-title">{ldn ? 'Loading' : amountChartData.title}</h1>
        {amountCharts ? <div className="tile-body">{amountCharts}</div> : null}
      </section>
    );

    return (
      <div className="content">
        <section className="tile intro">
          <h1 className="tile-title">Overview</h1>
          <div className="tile-body">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non nibh justo. Phasellus ac eros quis risus molestie molestie quis sit amet ipsum. Donec posuere augue tellus, ut volutpat ipsum feugiat in.</p>
            <p>Ut sodales pellentesque tempus. Nulla ac velit tempor, vestibulum lectus et, dapibus quam. Donec molestie cursus enim, quis eleifend lectus mollis at. Integer nec augue eleifend velit tempus ullamcorper eget ac ex. Integer finibus eget ex eu pulvinar. Mauris id nulla dui. Nulla fringilla tellus vitae purus tempus, id fermentum nisl maximus.</p>
          </div>
        </section>

        <section className="tile facts">
          <h1 className="tile-title">Key facts</h1>
          <div className="tile-body">
            <dl className="facts-list">
              <dt>total procurement procedures</dt>
              <dd>520.167</dd>
              <dt>total amount</dt>
              <dd>$4.239.000.120.758</dd>
              <dt>biggest contract</dt>
              <dd>API-Coatzacoalcos with PUENTES Y ESTRUCTURAS TOVEGO S.A DE C.V. for $51.375.215</dd>
              <dt>most active supplier</dt>
              <dd>INGENIERIA Y SERVICIOS ELECTROMECANICOS J &amp; M SA</dd>
              <dt>most active purchasing unit</dt>
              <dd>API-Coatzacoalcos</dd>
            </dl>
          </div>
        </section>

        {contractsTile}
        {amountTile}

      </div>
    );
  }
});

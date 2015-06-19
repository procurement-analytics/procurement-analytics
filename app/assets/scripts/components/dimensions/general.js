'use strict';
var Reflux = require('reflux');
var React = require('react/addons');
var _ = require('lodash');
var LineChart = require('../charts/line_chart');

var data = {
  y: {
    min: 0,
    max: 60,
    label: 'A value'
  },
  points: [
    { date: 'jan', count: 15 },
    { date: 'fev', count: 20 },
    { date: 'mar', count: 32 },
    { date: 'abr', count: 12 },
    { date: 'may', count: 45 },
    { date: 'jun', count: 44 },
    { date: 'jul', count: 47 },
    { date: 'ago', count: 22 },
    { date: 'sep', count: 30 },
    { date: 'oct', count: 25 },
    { date: 'nov', count: 18 },
    { date: 'dec', count: 12 },
  ]
};

var data2 = {
  y: {
    min: 0,
    max: 60,
    label: 'Some other value'
  },
  points: [
    { date: 'jan', count: 10 },
    { date: 'fev', count: 18 },
    { date: 'mar', count: 24 },
    { date: 'abr', count: 32 },
    { date: 'may', count: 30 },
    { date: 'jun', count: 40 },
    { date: 'jul', count: 48 },
    { date: 'ago', count: 54 },
    { date: 'sep', count: 44 },
    { date: 'oct', count: 36 },
    { date: 'nov', count: 20 },
    { date: 'dec', count: 20 },
  ]
};

var data3 = {
  y: {
    min: 0,
    max: 60,
    label: 'Some value'
  },

  points: [
    { date: 'jan', count: 20 },
    { date: 'fev', count: 10 },
    { date: 'mar', count: 15 },
    { date: 'abr', count: 10 },
    { date: 'may', count: 30 },
    { date: 'jun', count: 30 },
    { date: 'jul', count: 10 },
    { date: 'ago', count: 20 },
    { date: 'sep', count: 40 },
    { date: 'oct', count: 50 },
    { date: 'nov', count: 55 },
    { date: 'dec', count: 58 },
  ]
};


var IndGeneral = module.exports = React.createClass({

  propTypes: {
    data: React.PropTypes.object,
    x: React.PropTypes.object,
    y: React.PropTypes.object
  },

  render: function() {
    var ldn = this.props.loading;
    if (!ldn) {
      // Get the charts we want from the data
      var amountChartData = _.find(this.props.data.charts, {id: 'amount-time'});
      var contractsChartData = _.find(this.props.data.charts, {id: 'contracts-time'});

      // Check how many "mini-charts" we need to build for each chart.
      // Because these charts are of the type that spawn "mini-charts".

      ////// Chart contracts over time
      var contractsCharts = contractsChartData.data.map(function(o, i) {
        return <div className="chart-item" key={o._id + i}><LineChart data={o.data} x={contractsChartData.x}  y={contractsChartData.y}/></div>;
      });
      ////// Chart amount over time
      var amountCharts = amountChartData.data.map(function(o, i) {
        return <div className="chart-item" key={o._id + i}><LineChart data={o.data} x={amountChartData.x}  y={amountChartData.y}/></div>;
      });
    }

    // Build the tile for this contractsCharts.
    var contractsTile = (
      <section className={"tile chart-group" + (ldn ? ' loading' : '')}>
        <h1 className="tile-title">{ldn ? 'Loading' : contractsChartData.title}</h1>
        {ldn ? null :<div className="tile-body">{contractsCharts}</div>}
      </section>
    );

    // Build the tile for this amountCharts.
    var amountTile = (
      <section className={"tile chart-group" + (ldn ? ' loading' : '')}>
        <h1 className="tile-title">{ldn ? 'Loading' : amountChartData.title}</h1>
        {ldn ? null :<div className="tile-body">{amountCharts}</div>}
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

        <section className="tile">
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

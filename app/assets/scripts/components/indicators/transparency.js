'use strict';
var Reflux = require('reflux');
var React = require('react/addons');
var LineChart = require('../charts/line_chart');


var data = [
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
];

var data2 = [
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
];

var data3 = [
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
];

var IndTransparency = module.exports = React.createClass({

  propTypes: {
    data: React.PropTypes.array
  },

  render: function() {

    // DEV NOTE: For now we're doing here a switch based on comparison.
    // This should be done in the parent and the data passed through props.data

    var comparison = this.props.comparison || 'all';
    var charts = null;
    switch(comparison) {
      case 'all':
        charts = <LineChart data={data}/>;
      break;
      default:
        charts = (
          <div className="charts">
            <LineChart data={data2}/>
            <LineChart data={data3}/>
          </div>
        );
    }

    return (
      <div className="content">
        {charts}
        <p className="desc">In government procurement, transparency plays a pivotal role in success as it enables competition and promotes accountability of those making purchasing decisions.</p>
      </div>
    );
  }
});


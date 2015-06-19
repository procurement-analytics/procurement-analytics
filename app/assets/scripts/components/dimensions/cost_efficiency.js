'use strict';
var React = require('react/addons');
var Reflux = require('reflux');

var BoxChart = require('../charts/box_chart');
var BarChart = require('../charts/bar_chart');

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



var barData = {
  x: {
    min: 30,
    max: 150000,
    label: 'custom x label'
  },
  y: {
    min: 160,
    max: 400,
    label: 'another custom y label'
  },
  buckets: [
    200,
    400,
    380,
    298,
    180
  ]
};

var IndCostEfficiency = module.exports = React.createClass({

  propTypes: {
    data: React.PropTypes.array
  },

  render: function() {

    // THIS NEEDS TO BE CLEANED.
    // DEV NOTE: For now we're doing here a switch based on comparison.
    // This should be done in the parent and the data passed through props.data

    var data = null;
    var comparison = this.props.comparison || 'all';
    switch(comparison) {
      case 'all':
        data = [
          (<section className="tile chart-group">
            <h1 className="tile-title">Price distribution</h1>
            <div className="tile-body">
              <BarChart data={barData}/>
            </div>
          </section>),

          (<section className="tile chart-group">
            <h1 className="tile-title">Price variation</h1>
            <div className="tile-body">
              <BoxChart data={boxPlot1}/>
            </div>
          </section>)
        ];
      break;
      case 'contract_procedure':
        data = [
          (<section className="tile chart-group">
            <h1 className="tile-title">Price distribution</h1>
            <div className="tile-body">
              <BarChart data={barData}/>
            </div>
          </section>),

          (<section className="tile chart-group">
            <h1 className="tile-title">Price variation</h1>
            <div className="tile-body">
              <BoxChart data={boxPlot2}/>
            </div>
          </section>)
        ];
      break;
      case 'level_gov':
        data = [
          (<section className="tile chart-group">
            <h1 className="tile-title">Price distribution</h1>
            <div className="tile-body">
              <BarChart data={barData}/>
            </div>
          </section>),

          (<section className="tile chart-group">
            <h1 className="tile-title">Price variation</h1>
            <div className="tile-body">
              <BoxChart data={boxPlot3}/>
            </div>
          </section>)
        ];
      break;
    }
    return (
      <div className="content">
        <section className="tile intro">
          <h1 className="tile-title">Overview</h1>
          <div className="tile-body">
            <p>Paying the most economical price is a fundamental goal of any purchasing decision, whether on our private lives, corporate work or on government operations.</p>
          </div>
        </section>
        {data}
      </div>
    );
  }
});

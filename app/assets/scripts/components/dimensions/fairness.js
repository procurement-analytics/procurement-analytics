'use strict';
var Reflux = require('reflux');
var React = require('react/addons');
var ScatterplotChart = require('../charts/scatterplot_chart');


var relationshipData = {
  x: {
    min: 25000,
    max: 80888,
    label: 'Something or other x'
  },

  y: {
    min: 10,
    max: 150,
    label: 'Something or other y'
  },

  r: {
    min: 10,
    max: 40,
    label: 'Something or other r'
  },

  points: [
    {
      name: 'company1',
      suppliers: 10,
      contracts: 30,
      amount: 25000
    },
    {
      name: 'company2',
      suppliers: 15,
      contracts: 18,
      amount: 40000
    },
    {
      name: 'company3',
      suppliers: 22,
      contracts: 10,
      amount: 60000
    },
    {
      name: 'company4',
      suppliers: 26,
      contracts: 40,
      amount: 66000
    },
    {
      name: 'company5',
      suppliers: 10,
      contracts: 12,
      amount: 80888
    }
  ]
};

var IndFairness = module.exports = React.createClass({

  propTypes: {
    data: React.PropTypes.array
  },

  render: function() {

    // DEV NOTE: For now we're doing here a switch based on comparison.
    // This should be done in the parent and the data passed through props.data

    var data = null;
    var comparison = this.props.comparison || 'all';
    switch(comparison) {
      case 'all':
        data = (
          <div>
            <img src="assets/graphics/content/ch_top5-cont-all.png"/><br />
            <img src="assets/graphics/content/ch_winning-all.png"/>
            <img src="assets/graphics/content/ch_relationship-all.png"/>
          </div>
        );
      break;
      case 'contract_procedure':
        data = (
          <div>
            <img src="assets/graphics/content/ch_top5-cont-contr.png"/><br />
            <img src="assets/graphics/content/ch_winning-contr.png"/>
            <img src="assets/graphics/content/ch_relationship-contr.png"/>
          </div>
        );
      break;
      case 'level_gov':
        data = (
          <div>
            <img src="assets/graphics/content/ch_top5-cont-gov.png"/><br />
            <img src="assets/graphics/content/ch_winning-gov.png"/>
            <img src="assets/graphics/content/ch_relationship-gov.png"/>
          </div>
        );
      break;
    }
    return (
      <div className="content">
        <section className="tile intro">
          <h1 className="tile-title">Overview</h1>
          <div className="tile-body">
            <p>A level playing field is a linchpin of continuous competition for government contracts, and competition is a pre-requisite for cost-efficiency and quality.</p>
          </div>
        </section>
        {/* Clean me */}
        <ScatterplotChart data={relationshipData} />
        {data}
      </div>
    );
  }
});

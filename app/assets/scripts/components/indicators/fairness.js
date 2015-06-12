'use strict';
var Reflux = require('reflux');
var React = require('react/addons');
var AppStore = require('../../stores/app_store');
var ScatterplotChart = require('../shared/scatterplot_chart');


var relationshipData = [
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
];

var IndFairness = module.exports = React.createClass({
  mixins: [Reflux.listenTo(AppStore, "onAppStoreData")],

  getInitialState: function() {
    return {
      group: AppStore.getGroup()
    };
  },

  onAppStoreData: function(data) {
    this.setState({group: data.group});
  },

  render: function() {
    var data = null;
    switch(this.state.group) {
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
        <ScatterplotChart data={relationshipData} />
        <p className="desc">A level playing field is a linchpin of continuous competition for government contracts, and competition is a pre-requisite for cost-efficiency and quality.</p>
        {data}
      </div>
    );
  }
});
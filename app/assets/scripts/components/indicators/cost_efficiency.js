'use strict';
var React = require('react/addons');
var Reflux = require('reflux');
var AppStore = require('../../stores/app_store');

var BoxChart = require('../shared/box_chart');

var boxPlot1 = [
  {
    min: 100,
    max: 100099,
    whisker1: 100,
    q1: 16548,
    median: 33019,
    q3: 49566,
    whisker2: 99093
  },
  {
    min: 5000,
    max: 80000,
    whisker1: 5500,
    q1: 10000,
    median: 22344,
    q3: 28000,
    whisker2: 77527
  },
  {
    min: 71233,
    whisker1: 75000,
    q1: 77198,
    median: 85525,
    q3: 91036,
    whisker2: 99001,
    max: 99898
  }
];

var boxPlot2 = [
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
  },
  {
    min: 7193,
    whisker1: 7590,
    q1: 7798,
    median: 8595,
    q3: 9196,
    whisker2: 9991,
    max: 9998,
  },
];

var IndCostEfficiency = module.exports = React.createClass({
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
            <BoxChart data={boxPlot1}/>
            <img src="assets/graphics/content/ch_price-dist-all.png"/>
          </div>
        );
      break;
      case 'contract_procedure':
        data = (
          <div>
            <BoxChart data={boxPlot2}/>
            <img src="assets/graphics/content/ch_price-dist-contr.png"/>
          </div>
        );
      break;
      case 'level_gov':
        data = (
          <div>
            <BoxChart data={boxPlot2}/>
            <img src="assets/graphics/content/ch_price-dist-gov.png"/>
          </div>
        );
      break;
    }
    return (
      <div className="content">
        <p className="desc">Paying the most economical price is a fundamental goal of any purchasing decision, whether on our private lives, corporate work or on government operations.</p>
        {data}
      </div>
    );
  }
});

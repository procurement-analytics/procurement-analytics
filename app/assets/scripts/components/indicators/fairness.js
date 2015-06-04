'use strict';
var Reflux = require('reflux');
var React = require('react/addons');
var AppStore = require('../../stores/app_store');

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
            <img src="assets/graphics/content/ch_winning-all.png"/>
            <img src="assets/graphics/content/ch_relationship-all.png"/>
          </div>
        );
      break;
      case 'contract_procedure':
        data = (
          <div>
            <img src="assets/graphics/content/ch_winning-contr.png"/>
            <img src="assets/graphics/content/ch_relationship-contr.png"/>
          </div>
        );
      break;
      case 'level_gov':
        data = (
          <div>
            <img src="assets/graphics/content/ch_winning-gov.png"/>
            <img src="assets/graphics/content/ch_relationship-gov.png"/>
          </div>
        );
      break;
    }
    return (
      <div>
        <p className="desc">A level playing field is a linchpin of continuous competition for government contracts, and competition is a pre-requisite for cost-efficiency and quality.</p>
        {data}
      </div>
    );
  }
});
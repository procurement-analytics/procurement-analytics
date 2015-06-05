'use strict';
var React = require('react/addons');
var Reflux = require('reflux');
var AppStore = require('../../stores/app_store');

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
            <img src="assets/graphics/content/ch_price-var-all.png"/>
            <img src="assets/graphics/content/ch_price-dist-all.png"/>
          </div>
        );
      break;
      case 'contract_procedure':
        data = (
          <div>
            <img src="assets/graphics/content/ch_price-var-contr.png"/>
            <img src="assets/graphics/content/ch_price-dist-contr.png"/>
          </div>
        );
      break;
      case 'level_gov':
        data = (
          <div>
            <img src="assets/graphics/content/ch_price-var-gov.png"/>
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

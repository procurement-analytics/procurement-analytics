'use strict';
var Reflux = require('reflux');
var React = require('react/addons');
var AppStore = require('../../stores/app_store');

var IndTimeliness = module.exports = React.createClass({
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
            <img src="assets/graphics/content/ch_average-timeline-all.png"/>
          </div>
        );
      break;
      case 'contract_procedure':
        data = (
          <div>
            <img src="assets/graphics/content/ch_average-timeline-contr.png"/>
          </div>
        );
      break;
      case 'level_gov':
        data = (
          <div>
            <img src="assets/graphics/content/ch_average-timeline-gov.png"/>
          </div>
        );
      break;
    }
    return (
      <div>
        <p className="desc">Timely delivery of goods, works and services is a key indication of success in procurement, whether done by private sector companies or governments.</p>
        {data}
      </div>
    );
  }
});
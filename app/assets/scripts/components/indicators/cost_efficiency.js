'use strict';
var React = require('react/addons');
var Reflux = require('reflux');
var AppStore = require('../../stores/app_store');

var IndCostEfficiency = module.exports = React.createClass({
  mixins: [Reflux.listenTo(AppStore, "onAppStoreData")],

  getInitialState: function() {
    return {
      group: null
    };
  },

  onAppStoreData: function(data) {
    this.setState({group: data.group});
  },

  render: function() {
    var data = null;
    if (this.state.group) {
      data = (
        <div>
          <img src="assets/graphics/content/charts-04.png"/>
          <img src="assets/graphics/content/charts-10.png"/>
        </div>
      );
    }
    else {
      data = (
        <div>
          <img src="assets/graphics/content/charts-03.png"/>
          <img src="assets/graphics/content/charts-09.png"/>
        </div>
      );
    }
    return data;
  }
});

'use strict';
var Reflux = require('reflux');
var React = require('react/addons');
var AppStore = require('../../stores/app_store');

var IndFairness = module.exports = React.createClass({
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
          <img src="assets/graphics/content/charts-06.png"/>
          <img src="assets/graphics/content/charts-08.png"/>
        </div>
      );
    }
    else {
      data = (
        <div>
          <img src="assets/graphics/content/charts-05.png"/>
          <img src="assets/graphics/content/charts-07.png"/>
        </div>
      );
    }
    return data;
  }
});
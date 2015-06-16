'use strict';
var React = require('react/addons');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var IndTimeliness = require('./indicators/timeliness');
var IndTransparency = require('./indicators/transparency');
var IndCostEfficiency = require('./indicators/cost_efficiency');
var IndQuality = require('./indicators/quality');
var IndFairness = require('./indicators/fairness');
var IndGeneral = require('./indicators/general');

var Analysis = module.exports = React.createClass({

  getInitialState: function() {
    return {
      data: []
    }
  },

  componentDidMount: function() {
    console.log('Analysis -- componentDidMount');
    // Fetch data first time.
  },

  componentDidUpdate: function(/*prevProps, prevState*/) {
    console.log('Analysis -- componentDidUpdate');
    // Fetch data on url update.
  },

  render: function() {
    switch(this.props.params.indicator) {
      case 'summary':
        return <IndGeneral data={this.state.data} comparison={this.props.params.comparison}/>;
      break;
      case 'timeliness':
        return <IndTimeliness data={this.state.data} comparison={this.props.params.comparison}/>;
      break;
      case 'cost_efficiency':
        return <IndCostEfficiency data={this.state.data} comparison={this.props.params.comparison}/>;
      break;
      case 'fairness':
        return <IndFairness data={this.state.data} comparison={this.props.params.comparison}/>;
      break;
      case 'transparency':
        return <IndTransparency data={this.state.data} comparison={this.props.params.comparison}/>;
      break;
      case 'quality':
        return <IndQuality data={this.state.data} comparison={this.props.params.comparison}/>;
      break;
      default:
        return <div>This is not what you are looking for</div>;
    }
  }
});

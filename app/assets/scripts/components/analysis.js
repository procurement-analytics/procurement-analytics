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
    var indicator = null;
    switch(this.props.params.indicator) {
      case 'summary':
        indicator = <IndGeneral data={this.state.data} comparison={this.props.params.comparison}/>;
      break;
      case 'timeliness':
        indicator = <IndTimeliness data={this.state.data} comparison={this.props.params.comparison}/>;
      break;
      case 'cost_efficiency':
        indicator = <IndCostEfficiency data={this.state.data} comparison={this.props.params.comparison}/>;
      break;
      case 'fairness':
        indicator = <IndFairness data={this.state.data} comparison={this.props.params.comparison}/>;
      break;
      case 'transparency':
        indicator = <IndTransparency data={this.state.data} comparison={this.props.params.comparison}/>;
      break;
      case 'quality':
        indicator = <IndQuality data={this.state.data} comparison={this.props.params.comparison}/>;
      break;
    }

    return (
      <section>
        <header>
          <h1>showing this thing</h1>
        </header>
        <div className="body">{indicator}</div>
      </section>
    );


  }
});

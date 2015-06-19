'use strict';
var React = require('react/addons');
var Router = require('react-router');
var _ = require('lodash');

var analysisNlForm = require('../utils/analysis_nl_form');

var DimTimeliness = require('./dimensions/timeliness');
var DimCostEfficiency = require('./dimensions/cost_efficiency');
var DimFairness = require('./dimensions/fairness');
var DimGeneral = require('./dimensions/general');

var NlForm = require('./nl_form');

var Analysis = module.exports = React.createClass({

  mixins: [Router.Navigation],

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

  onNlSelect: function(selection) {
    console.log('selection', selection);

    if (selection.comparison == 'all') {
      return this.transitionTo('analysis_summary', {dimension: selection.dimension});
    }

    this.transitionTo('analysis', {dimension: selection.dimension, comparison: selection.comparison});
  },

  render: function() {

    var routerDimension = this.props.params.dimension;
    var routerComparison = this.props.params.comparison || 'all';

    var nlformSentence = analysisNlForm.getSentence();
    // Update nlform fields active value based on router.
    var nlformFields = analysisNlForm.fields
      .setActive('dimension', routerDimension)
      .setActive('comparison', routerComparison)
      .value();

    var dimension = null;
    
    switch(this.props.params.dimension) {
      case 'summary':
        dimension = <DimGeneral data={this.state.data} comparison={this.props.params.comparison}/>;
      break;
      case 'timeliness':
        dimension = <DimTimeliness data={this.state.data} comparison={this.props.params.comparison}/>;
      break;
      case 'cost-efficiency':
        dimension = <DimCostEfficiency data={this.state.data} comparison={this.props.params.comparison}/>;
      break;
      case 'fairness':
        dimension = <DimFairness data={this.state.data} comparison={this.props.params.comparison}/>;
      break;
    }

    return (
      <section className="page viz analytics">
        <header className="page-header">
          <div className="inner">
            <div className="page-headline">
              <h1 className="page-title"><NlForm sentence={nlformSentence} fields={nlformFields} onNlSelect={this.onNlSelect} /></h1>
            </div>
          </div>
        </header>
        <div className="page-body">
          <div className="inner">
            <div className="prose">
              {dimension}
            </div>
          </div>
        </div>
      </section>
    );
  }
});

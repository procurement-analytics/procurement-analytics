'use strict';
var React = require('react/addons');
var Router = require('react-router');
var _ = require('lodash');

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

    var nlformSentence = 'Showing {#dimensionArticle#} {%dimension%} of the procurement process {#comparisonArticle#} {%comparison%}.';
    var nlformFields = [
      {
        id: 'comparison',
        active: 'all',

        opts: [
          {
            key: 'all',
            value: 'full data set',
            tokens: {
              'comparisonArticle': 'for the'
            }
          },
          {
            key: 'level_gov',
            value: 'level of government',
            tokens: {
              'comparisonArticle': 'for'
            }
          },
          {
            key: 'contract_procedure',
            value: 'contract procedure',
            tokens: {
              'comparisonArticle': 'for'
            }
          }
        ]
      },

      {
        id: 'dimension',
        active: 'summary',

        opts: [
          {
            key: 'summary',
            value: 'summary',
            tokens: {
              'dimensionArticle': 'a'
            }
          },
          {
            key: 'timeliness',
            value: 'timeliness',
            tokens: {
              'dimensionArticle': ''
            }
          },
          {
            key: 'cost-efficiency',
            value: 'cost efficiency',
            tokens: {
              'dimensionArticle': ''
            }
          },
          {
            key: 'fairness',
            value: 'fairness',
            tokens: {
              'dimensionArticle': ''
            }
          }
        ]
      }
    ];

    var routerDimension = this.props.params.dimension;
    var routerComparison = this.props.params.comparison || 'all';

    // Update values.
    _.find(nlformFields, {id: 'dimension'}).active = routerDimension;
    _.find(nlformFields, {id: 'comparison'}).active = routerComparison;

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

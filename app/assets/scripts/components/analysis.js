'use strict';
var React = require('react/addons');
var Router = require('react-router');
var _ = require('lodash');

var IndTimeliness = require('./indicators/timeliness');
var IndTransparency = require('./indicators/transparency');
var IndCostEfficiency = require('./indicators/cost_efficiency');
var IndQuality = require('./indicators/quality');
var IndFairness = require('./indicators/fairness');
var IndGeneral = require('./indicators/general');

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
      return this.transitionTo('analysis_summary', {indicator: selection.indicator});
    }

    this.transitionTo('analysis', {indicator: selection.indicator, comparison: selection.comparison});
  },

  render: function() {

    var nlformSentence = 'Showing {#indicatorArticle#} {%indicator%} of the procurement process {#comparisonArticle#} {%comparison%}.';
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
        id: 'indicator',
        active: 'summary',

        opts: [
          {
            key: 'summary',
            value: 'summary',
            tokens: {
              'indicatorArticle': 'a'
            }
          },
          {
            key: 'timeliness',
            value: 'timeliness',
            tokens: {
              'indicatorArticle': ''
            }
          },
          {
            key: 'cost-efficiency',
            value: 'cost efficiency',
            tokens: {
              'indicatorArticle': ''
            }
          }
        ]
      }
    ];

    var routerIndicator = this.props.params.indicator;
    var routerComparison = this.props.params.comparison || 'all';

    // Update values.
    _.find(nlformFields, {id: 'indicator'}).active = routerIndicator;
    _.find(nlformFields, {id: 'comparison'}).active = routerComparison;

    var indicator = null;
    
    switch(this.props.params.indicator) {
      case 'summary':
        indicator = <IndGeneral data={this.state.data} comparison={this.props.params.comparison}/>;
      break;
      case 'timeliness':
        indicator = <IndTimeliness data={this.state.data} comparison={this.props.params.comparison}/>;
      break;
      case 'cost-efficiency':
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
              {indicator}
            </div>
          </div>
        </div>
      </section>
    );
  }
});

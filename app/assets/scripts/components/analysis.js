'use strict';
var React = require('react/addons');
var Reflux = require('reflux');
var Router = require('react-router');
var _ = require('lodash');

var analysisNlForm = require('../utils/analysis_nl_form');
var actions = require('../actions/actions');
var appStore = require('../stores/app_store');
var NlForm = require('./nl_form');

// Dimension pages.
var DimTimeliness = require('./dimensions/timeliness');
var DimCostEfficiency = require('./dimensions/cost_efficiency');
var DimFairness = require('./dimensions/fairness');
var DimGeneral = require('./dimensions/general');

var Analysis = module.exports = React.createClass({

  mixins: [
    Reflux.listenTo(appStore, "onData"),
    Router.Navigation
  ],

  getInitialState: function() {
    return {
      data: {},
      loading: true
    }
  },

  /**
   * Listener: Data from the store.
   */
  onData: function(err, storage) {
    if (err) return;
    this.setState({
      data: storage.data,
      loading: false
    });
  },

  /**
   * Listener: Change on nlForm options.
   */
  onNlSelect: function(selection) {
    console.log('nl onNlSelect', selection);
    var params = {dimension: selection.dimension, comparison: selection.comparison};
    this.transitionTo(selection.comparison == 'all' ? 'analysis_summary' : 'analysis', params);
  },

  /**
   * Lifecycle: Component mount.
   */
  componentDidMount: function() {
    // Fetch data first time.
    actions.loadData(this.props.params.dimension, this.props.params.comparison || 'all');
    this.setState({loading: true});
  },

  /**
   * Lifecycle: Component props update.
   */
  componentWillReceiveProps: function(nextProps) {
    // Fetch data on url update.
    actions.loadData(nextProps.params.dimension, nextProps.params.comparison || 'all');
    this.setState({loading: true});
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

    var Dimension = null;
    
    switch(routerDimension) {
      case 'summary':
        Dimension = DimGeneral;
      break;
      case 'timeliness':
        Dimension = DimTimeliness;
      break;
      case 'cost-efficiency':
        Dimension = DimCostEfficiency;
      break;
      case 'fairness':
        Dimension = DimFairness;
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
          {Dimension ? <Dimension loading={this.state.loading} data={this.state.data} comparison={this.props.params.comparison}/> : null}
        </div>
      </section>
    );
  }
});

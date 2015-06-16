'use strict';
var React = require('react/addons');
var _ = require('lodash');
var actions = require('../actions/actions');
var AppStore = require('../stores/app_store');

var Filters = module.exports = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      group: AppStore.getGroup()
    };
  },

  onGroupingChange: function(group, event) {
    actions.groupChange(group);
    this.setState({group: group});
  },

  getGroupBttnClass: function(group) {
    var comparison = this.context.router.getCurrentParams().comparison;
    if (!comparison) {
      comparison = 'all';
    }
    return "bttn bttn-m bttn-base-light" + (comparison == group ? ' active' : '');
  },

  getGroupPath: function(group) {
    var params = _.clone(this.context.router.getCurrentParams());
    if (group == 'all') {
      return this.context.router.makeHref('analysis_summary', params);
    }
    params.comparison = group;
    return this.context.router.makeHref('analysis', params);
  },

  render: function() {
    return (
      <div className="bttn-group">
        <a href={this.getGroupPath('all')} className={this.getGroupBttnClass('all')}>No Comparison</a>
        <a href={this.getGroupPath('contract_procedure')} className={this.getGroupBttnClass('contract_procedure')}>Contract Procedure</a>
        <a href={this.getGroupPath('level_gov')} className={this.getGroupBttnClass('level_gov')}>Level of Government</a>
      </div>
    );
  }
});

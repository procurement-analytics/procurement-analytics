'use strict';
var React = require('react/addons');
var actions = require('../actions/actions');
var AppStore = require('../stores/app_store');

var Filters = module.exports = React.createClass({

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
    return "bttn bttn-m bttn-base-light" + (this.state.group == group ? ' active' : '');
  },

  render: function() {
    return (
      <div className="bttn-group">
        <button className={this.getGroupBttnClass('all')} onClick={this.onGroupingChange.bind(this, 'all')}>No Comparisson</button>
        <button className={this.getGroupBttnClass('contract_procedure')} onClick={this.onGroupingChange.bind(this, 'contract_procedure')}>Contract Procedure</button>
        <button className={this.getGroupBttnClass('level_gov')} onClick={this.onGroupingChange.bind(this, 'level_gov')}>Level of Government</button>
      </div>
    );
  }
});
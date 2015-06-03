'use strict';
var React = require('react/addons');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Navigation = require('./navigation');
var Filters = require('./filters');
var actions = require('../actions/actions');

var App = module.exports = React.createClass({
  onGroupingChange: function(e) {
    actions.groupChange(e.target.value);
  },

  render: function() {
    return (
      <div>
        <header id="site-header" role="banner">
          <h1 id="site-title"><a href="#/" title="Go Home">Procurement</a></h1>
          <nav id="site-prime-nav" role="navigation">
            <div>
              <label htmlFor="grouping"></label>
              <select name="grouping" id="grouping" onChange={this.onGroupingChange}>
                <option value="">-- None --</option>
                <option value="contract_procedure">Contract Procedure</option>
              </select>
            </div>
            <Navigation />
          </nav>
        </header>
        <main id="site-body" role="main">
          <RouteHandler />
        </main>
      </div>
    );
  }
});

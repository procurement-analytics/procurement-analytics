'use strict';
var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;

var Navigation = module.exports = React.createClass({
  render: function() {
    return (
      <ul id="indicators">
        <li><Link to="analysis_summary" params={{indicator: 'summary'}}>General</Link></li>
        <li><Link to="analysis_summary" params={{indicator: 'timeliness'}}>Timeliness</Link></li>
        <li><Link to="analysis_summary" params={{indicator: 'cost_efficiency'}}>Cost Efficiency</Link></li>
        <li><Link to="analysis_summary" params={{indicator: 'fairness'}}>Fairness</Link></li>
        <li><Link to="analysis_summary" params={{indicator: 'transparency'}}>Transparency</Link></li>
        <li><Link to="analysis_summary" params={{indicator: 'quality'}}>Quality</Link></li>
      </ul>
    );
  }
});

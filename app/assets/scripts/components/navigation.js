'use strict';
var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;

var Navigation = module.exports = React.createClass({
  render: function() {
    return (
      <ul id="indicators">
        <li><Link to="home">General</Link></li>
        <li><Link to="timeliness">Timeliness</Link></li>
        <li><Link to="cost_efficiency">Cost Efficiency</Link></li>
        <li><Link to="fairness">Fairness</Link></li>
        <li><Link to="transparency">Transparency</Link></li>
        <li><Link to="quality">Quality</Link></li>
      </ul>
    );
  }
});

'use strict';
var React = require('react/addons');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var Navigation = require('./navigation');
var Filters = require('./filters');

var App = module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <header id="site-header" role="banner">
          <div id="site-headline">
            <h1 id="site-title"><a href="#/" title="Start"><span>Procurement Dashboards</span></a></h1>
          </div>
          <nav id="site-prime-nav" role="navigation">
            <ul className="global-menu">
              <li className="analysis"><Link to="analysis_summary" params={{indicator: 'summary'}} title="View the analysis"><span>Analysis</span></Link></li>
              <li className="about"><Link to="about" title="Learn more"><span>About</span></Link></li>
            </ul>
          </nav>
        </header>
        <main id="site-body" role="main">
          <RouteHandler />
        </main>
      </div>
    );
  }
});
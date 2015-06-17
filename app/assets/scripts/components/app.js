'use strict';
var React = require('react/addons');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Navigation = require('./navigation');
var Filters = require('./filters');

var App = module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <header id="site-header" role="banner">
          <div className="header-bar">
            <h1 id="site-title"><a href="#/" title="Go Home">Procurement Dashboards</a></h1>
          </div>
          <nav id="site-prime-nav" role="navigation">
            <div className="nav-block-prime">
              <ul>
                <li><a href="#/about">About</a></li>
              </ul>
            </div>
          </nav>
        </header>
        <main id="site-body" role="main">
          <RouteHandler />
        </main>
      </div>
    );
  }
});

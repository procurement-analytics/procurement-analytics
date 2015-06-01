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
          <h1 id="site-title"><a href="#/" title="Go Home">Procurement</a></h1>
          <nav id="site-prime-nav" role="navigation">
            <Filters />
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

'use strict';
var React = require('react/addons');
var Router = require('react-router');
var NotFoundRoute = Router.NotFoundRoute;
var Navigation = Router.Navigation;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;
var DefaultRoute = Router.DefaultRoute;
var Redirect = Router.Redirect;


var App = require('./components/app');
var About = require('./components/about-es');
var Analysis = require('./components/analysis');

var routes = module.exports = (
  <Route path="/" handler={App}>

    <Route name="about" path="about" handler={About} />

    <Route name="analysis_root" path="analysis" handler={Analysis}>
        <Route name="analysis_summary" path=":dimension" handler={Analysis}>
          <Route name="analysis" path=":comparison" handler={Analysis} />
        </Route>
        <Redirect from="/analysis" to="analysis_summary" params={{dimension: 'summary'}} />
    </Route>

    <Redirect from="/" to="analysis_summary" params={{dimension: 'summary'}} />
  </Route>
);
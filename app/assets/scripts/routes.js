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
var IndTimeliness = require('./components/indicators/timeliness');
var IndTransparency = require('./components/indicators/transparency');
var IndCostEfficiency = require('./components/indicators/cost_efficiency');
var IndQuality = require('./components/indicators/quality');
var IndFairness = require('./components/indicators/fairness');
var IndGeneral = require('./components/indicators/general');

var routes = module.exports = (
  <Route path="/" handler={App}>
    <DefaultRoute name="home" handler={IndGeneral} />
    <Route name="timeliness" handler={IndTimeliness}/>
    <Route name="transparency" handler={IndTransparency}/>
    <Route name="cost_efficiency" handler={IndCostEfficiency}/>
    <Route name="quality" handler={IndQuality}/>
    <Route name="fairness" handler={IndFairness}/>
  </Route>
);
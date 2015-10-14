'use strict';
var React = require('react/addons');
var Router = require('react-router');
var routes = require('./routes');
var i18n = require("./components/i18n");

document.title = i18n.t("DashboardTitle");

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('site-canvas'));
});
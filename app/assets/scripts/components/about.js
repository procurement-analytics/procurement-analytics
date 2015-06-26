'use strict';
var React = require('react/addons');
var Router = require('react-router');

var About = module.exports = React.createClass({
  render: function() {
    return (
      <article className="page single about">
        <header className="page-header">
          <div className="inner">
            <div className="page-headline">
              <h1 className="page-title">About</h1>
            </div>
          </div>
        </header>
        <div className="page-body">
          <div className="inner">
            <div className="prose">
              <h2>The project</h2>
              <p>Intro to the project and partners...</p>
              <h2>Data sources</h2>
              <ul>
                <li><strong><a href="https://sites.google.com/site/cnetuc/contrataciones">Compranet</a></strong> is the main data source that powers these dashboards.</li>
                <li>...</li>
              </ul>
              <h2>License</h2>
              <p>The codebase of the application has been released into the public domain using the unlicense[link to license in GH repo].</p>
              <p>Feel free to use Feel free to fork... [link to Github]</p>
            </div>
          </div>
        </div>
        <footer className="page-footer">
          <div className="inner">
            <ul className="credits-list">
              <li className="wbg-logo-wrapper"><a href="http://www.worldbank.org/" title="Visit The World Bank"><img alt="The World Bank logo" src="assets/graphics/layout/wbg-logo-pos.svg" width="160" height="32" /><span>The World Bank</span></a></li>
              <li className="ds-logo-wrapper"><a href="https://developmentseed.org/" title="Visit Development Seed"><img alt="Development Seed logo" src="assets/graphics/layout/ds-logo-pos.svg" width="188" height="32" /><span>Development Seed</span></a></li>
            </ul>
          </div>
        </footer>
      </article>
    );
  }
});

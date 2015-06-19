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
              <h2>Lorem ipsum dolor sit amet</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non nibh justo. Phasellus ac eros quis risus molestie molestie quis sit amet ipsum. Donec posuere augue tellus, ut volutpat ipsum feugiat in.</p>
              <p>Ut sodales pellentesque tempus. Nulla ac velit tempor, vestibulum lectus et, dapibus quam. Donec molestie cursus enim, quis eleifend lectus mollis at. Integer nec augue eleifend velit tempus ullamcorper eget ac ex. Integer finibus eget ex eu pulvinar. Mauris id nulla dui. Nulla fringilla tellus vitae purus tempus, id fermentum nisl maximus.</p>
              <h3>Vestibulum lectus et</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non nibh justo. Phasellus ac eros quis risus molestie molestie quis sit amet ipsum. Donec posuere augue tellus, ut volutpat ipsum feugiat in.</p>
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

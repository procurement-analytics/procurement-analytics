'use strict';
var React = require('react/addons');
var Router = require('react-router');

var About = module.exports = React.createClass({
  render: function() {
    return (
      <article>
        <header>
          <h1>About</h1>
        </header>
        <div className="body">This is about me not you!</div>
      </article>
    );
  }
});

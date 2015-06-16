'use strict';
var Reflux = require('reflux');
var React = require('react/addons');

var IndTimeliness = module.exports = React.createClass({

  propTypes: {
    data: React.PropTypes.array
  },

  render: function() {

    // DEV NOTE: For now we're doing here a switch based on comparison.
    // This should be done in the parent and the data passed through props.data

    var data = null;
    var comparison = this.props.comparison || 'all';
    switch(comparison) {
      case 'all':
        data = (
          <div>
            <img src="assets/graphics/content/ch_average-timeline-all.png"/>
          </div>
        );
      break;
      case 'contract_procedure':
        data = (
          <div>
            <img src="assets/graphics/content/ch_average-timeline-contr.png"/>
          </div>
        );
      break;
      case 'level_gov':
        data = (
          <div>
            <img src="assets/graphics/content/ch_average-timeline-gov.png"/>
          </div>
        );
      break;
    }
    return (
      <div className="content">
        <p className="desc">Timely delivery of goods, works and services is a key indication of success in procurement, whether done by private sector companies or governments.</p>
        {data}
      </div>
    );
  }
});
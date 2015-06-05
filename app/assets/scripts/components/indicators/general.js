'use strict';
var Reflux = require('reflux');
var React = require('react/addons');
var AppStore = require('../../stores/app_store');

var IndGeneral = module.exports = React.createClass({
  mixins: [Reflux.listenTo(AppStore, "onAppStoreData")],

  getInitialState: function() {
    return {
      group: AppStore.getGroup()
    };
  },

  onAppStoreData: function(data) {
    this.setState({group: data.group});
  },

  render: function() {
    var charts = null;
    switch(this.state.group) {
      case 'all':
        charts = (
          <div>
            <img src="assets/graphics/content/ch_general-contract-all.png"/>
            <img src="assets/graphics/content/ch_general-amount-all.png"/>
          </div>
        );
      break;
      case 'contract_procedure':
        charts = (
          <div>
            <img src="assets/graphics/content/ch_general-contract-contr.png"/>
            <img src="assets/graphics/content/ch_general-amount-contr.png"/>
          </div>
        );
      break;
      case 'level_gov':
        charts = (
          <div>
            <img src="assets/graphics/content/ch_general-contract-gov.png"/>
            <img src="assets/graphics/content/ch_general-amount-gov.png"/>
          </div>
        );
      break;
    }

    return (
      <div className="content">
        <p className="desc">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc non nibh justo. Phasellus ac eros quis risus molestie molestie quis sit amet ipsum. Donec posuere augue tellus, ut volutpat ipsum feugiat in. Ut sodales pellentesque tempus. Nulla ac velit tempor, vestibulum lectus et, dapibus quam. Donec molestie cursus enim, quis eleifend lectus mollis at. Integer nec augue eleifend velit tempus ullamcorper eget ac ex. Integer finibus eget ex eu pulvinar. Mauris id nulla dui. Nulla fringilla tellus vitae purus tempus, id fermentum nisl maximus.</p>

          <ul>
            <li><strong>total procurement procedures:</strong> 520.167</li>
            <li><strong>total amount:</strong> $4.239.000.120.758</li>
            <li><strong>biggest contract:</strong> API-Coatzacoalcos with PUENTES Y ESTRUCTURAS TOVEGO S.A DE C.V. for $51.375.215</li>
            <li><strong>most active supplier:</strong> INGENIERIA Y SERVICIOS ELECTROMECANICOS J &amp; M SA</li>
            <li><strong>most active purchasing unit:</strong> API-Coatzacoalcos</li>
          </ul>

          <div>
            {charts}
          </div>
      </div>
    );
  }
});


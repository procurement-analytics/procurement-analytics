'use strict';
var Reflux = require('reflux');
var d3 = require('d3');
var _ = require('lodash');
var actions = require('../actions/actions');

var AppStore = module.exports = Reflux.createStore({

  storage: {
    data: {}
  },

  // Called on creation.
  // Setup listeners.
  init: function() {
    this.listenTo(actions.loadData, this.loadData);
  },

  loadData: function(dimension, comparison) {
    var _this = this;
    // Dev throttle.
    //setTimeout(function() {
      var url = 'data/' + _.kebabCase(dimension) + '--' + _.kebabCase(comparison) + '.json';
      d3.json(url, function(error, json) {
        if (error) {
          console.warn(error);
          _this.trigger(error);
          return;
        }
        _this.storage.data = json;
        _this.trigger(null, _this.storage);
      });
    //}, 2000);
  }
});
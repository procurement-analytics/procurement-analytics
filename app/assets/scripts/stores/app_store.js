'use strict';
var Reflux = require('reflux');
var actions = require('../actions/actions');

var AppStore = module.exports = Reflux.createStore({

  storage: {
    group: 'all'
  },

  // Called on creation.
  // Setup listeners.
  init: function() {
    this.listenTo(actions.groupChange, this.onGroupChange);
  },

  getGroup: function() {
    return this.storage.group;
  },

  onGroupChange: function(group) {
    this.storage.group = group ? group : null;
    this.trigger(this.storage);
  }

});
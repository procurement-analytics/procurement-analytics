'use strict';
var _ = require('lodash');

var fields = [
  {
    id: 'comparison',
    active: 'all',

    opts: [
      {
        key: 'all',
        value: 'full data set',
        tokens: {
          'comparisonArticle': 'for the'
        }
      },
      {
        key: 'level_gov',
        value: 'level of government',
        tokens: {
          'comparisonArticle': 'for'
        }
      },
      {
        key: 'contract_procedure',
        value: 'contract procedure',
        tokens: {
          'comparisonArticle': 'for'
        }
      }
    ]
  },

  {
    id: 'dimension',
    active: 'summary',

    opts: [
      {
        key: 'summary',
        value: 'summary',
        tokens: {
          'dimensionArticle': 'a'
        }
      },
      {
        key: 'timeliness',
        value: 'timeliness',
        tokens: {
          'dimensionArticle': ''
        }
      },
      {
        key: 'cost-efficiency',
        value: 'cost efficiency',
        tokens: {
          'dimensionArticle': ''
        }
      },
      {
        key: 'fairness',
        value: 'fairness',
        tokens: {
          'dimensionArticle': ''
        }
      }
    ]
  }
];

module.exports.getSentence = function() { 
  return 'Showing {#dimensionArticle#} {%dimension%} of the procurement process {#comparisonArticle#} {%comparison%}.';
};

module.exports.fields = function() {
  return fields;
};

module.exports.fields.value = function() {
  return fields;
};

module.exports.fields.setActive = function(fieldname, activeOpt) {
   _.find(fields, {id: fieldname}).active = activeOpt;
   return this;
};
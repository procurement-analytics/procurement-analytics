'use strict';
var numeral = require('numeral');

module.exports.chartGroupClass = function(group) {
  var tot = group ? group.length : 0;
  var klass = 'chart-group-';
  switch (tot) {
    case 0:
      return '';
    break;
    case 1:
      klass += 1;
    break;
    case 2:
    case 4:
      klass += 2;
    break;
    default:
      klass += 3;
  }
  return ' ' + klass + ' ';
};

module.exports.formatToMillion = function(val) {
  var suffix = '';
  if (val / 1e6 >= 1) {
    suffix = ' M';
    val = Math.round(val / 1e6);
  }
  return numeral(val).format('0,0[.]0') + suffix;
};
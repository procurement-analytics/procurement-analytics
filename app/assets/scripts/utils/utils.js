'use strict';

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
}
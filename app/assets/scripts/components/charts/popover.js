'use strict';
var React = require('react/addons');
var $ = require('jquery');

function popover() {

  var _content = null;
  var $popover = null;

  this.setContent = function(ReactElement) {
    _content = React.renderToStaticMarkup(
      <div className="popover">
        {ReactElement}
      </div>
    );
    return this;
  }

  this.show = function(anchorX, anchorY) {
    if (_content === null) {
      console.warn('Content must be set before showing the popover.');
      return this;
    }

    $popover = $(_content);
    $('#site-canvas').append($popover);

    // Set position on next tick.
    // Otherwise the popover has no spatiality.
    setTimeout(function() {
      var containerW = $('#site-canvas').outerWidth();
      var sizeW = $popover.outerWidth();
      var sizeH = $popover.outerHeight();

      var leftOffset = anchorX  - sizeW / 2;
      var topOffset = anchorY - sizeH - 8;

      // If the popover would be to appear outside the window on the right
      // move it to the left by that amount.
      // And add some padding.
      var overflowR = (leftOffset + sizeW) - containerW ;
      if (overflowR > 0) {
        leftOffset -= overflowR + 16;
      }

      // Same for the left side.
      if (leftOffset < 0) {
        leftOffset = 16;
      }

      $popover
      .css('left', leftOffset + 'px')
      .css('top', topOffset + 'px');
    }, 1);

    return this;
  }

  this.hide = function() {
    $popover.remove();
    return this;
  }

  return this;
};

module.exports = popover;
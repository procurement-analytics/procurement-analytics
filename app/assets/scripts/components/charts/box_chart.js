'use strict';
var React = require('react/addons');
var d3 = require('d3');
var _ = require('lodash');
var popover = require('./popover');

var BoxChart = module.exports = React.createClass({
  chart: null,

  onWindowResize: function() {
    this.chart.update();
  },

  componentDidMount: function() {

    console.log('BoxChart componentDidMount');
    // Debounce event.
    this.onWindowResize = _.debounce(this.onWindowResize, 200);

    window.addEventListener('resize', this.onWindowResize);
    this.chart = new d3BoxChart(this.getDOMNode(), this.props);
  },

  componentWillUnmount: function() {
    console.log('BoxChart componentWillUnmount');
    window.removeEventListener('resize', this.onWindowResize);
    this.chart.destroy();
  },

  componentDidUpdate: function(/*prevProps, prevState*/) {
    console.log('BoxChart componentDidUpdate');
    this.chart.setData(this.props);
  },

  render: function() {
    return (
      <div className="boxChart"></div>
    );
  }
});




var d3BoxChart = function(el, data) {
  this.$el = d3.select(el);

  this.data = null;
  this.xData = null;

  // Chart lifecycle:
  // _init()
  //   Creates the chart elements.
  // update()
  //   Called whenever the chart needs to be updated.
  // destroy()
  //   Called before destroying the chart.

  // Var declaration.
  var margin = {top: 30, right: 32, bottom: 50, left: 50, gap: 32};
  // width and height refer to the data canvas. To know the svg size the margins
  // must be added.
  var _width, _height;
  // Scales, Axis, and line functions.
  var x, y, xAxis, yAxis, line;
  // Elements.
  var svg, dataCanvas;
  // Data max and min.
  var min, max;
  // Individual box size.
  var boxSize;
  // Function to construct each on of the boxes.
  var boxChart;
  // Init the popover.
  var chartPopover = new popover();

  this._calcSize = function() {
    _width = parseInt(this.$el.style('width'), 10) - margin.left - margin.right;
    _height = parseInt(this.$el.style('height'), 10) - margin.top - margin.bottom;
  };

  this.setData = function(data) {
    var _data = _.cloneDeep(data);
    this.data = _data.data;
    this.xData = _data.x;
    this.update();
  };

  /**
   * Returns a function that is going to be used by d3 to draw each one of
   * the boxes.
   *
   * @return function
   *
   * Code highly borrowed from:
   * http://bl.ocks.org/mbostock/4061502
   * https://gist.github.com/asizer/11198007
   */
  this._box = function() {
    var width = 1;
    var height = 1;
    var duration = 0;
    var domain = null;
    var value = Number;
    var tickFormat = null;

    function box(g) {
      g.each(function(d, i) {
        var g = d3.select(this).attr('class', 'boxplot-container');
        var min = d.min;
        var max = d.max;

        var whiskerData = [d.whisker1, d.whisker2];
        var quartileData = [d.q1, d.median, d.q3];
        var textMarginBottom = 14;
        var textSize = 14;

        var boxOffset = textSize + textMarginBottom;
        var boxHeight = height - (textSize + textMarginBottom);

        // Compute the x-scale.
        var x = d3.scale.linear()
            .domain(domain && domain.call(this, d, i) || [min, max])
            .range([0, width]);

        var label = g.selectAll('text.label')
          .data([d.label]);

        label.enter().append('text')
          .attr('class', 'label')
          .attr('font-size', 14)
          .attr('y', textSize)
          .text(function(v) { return v; });

        label
          .attr('y', textSize)
          .text(function(v) { return v; });

        // Note: the box, median, and box tick elements are fixed in number,
        // so we only have to handle enter and update. In contrast, the outliers
        // and other elements are variable, so we need to exit them!
        // (Except this is a static chart, so no transitions, so no exiting)

        // Update center line: the horizontal line spanning the whiskers.
        var boxGroup = g.selectAll('g.boxplot')
          .data([d]);

        boxGroup.enter().append('g')
          .attr('class', 'boxplot')
          .attr("transform", "translate(0," + boxOffset + ")");

        boxGroup
          .attr("transform", "translate(0," + boxOffset + ")");

        var center = boxGroup.selectAll('line.center')
            .data([whiskerData]);

        center.enter().insert('line', 'rect')
          .attr('class', 'center')
          .attr('x1', function(d) { return x(d[0]); })
          .attr('y1', boxHeight / 2)
          .attr('x2', function(d) { return x(d[1]); })
          .attr('y2', boxHeight / 2);

        center.transition()
          .attr('y1', boxHeight / 2)
          .attr('x1', function(d) { return x(d[0]); })
          .attr('y2', boxHeight / 2)
          .attr('x2', function(d) { return x(d[1]); });

        // Update innerquartile box.
        var box = boxGroup.selectAll('rect.box')
          .data([quartileData]);

        box.enter().append('rect')
          .attr('class', 'box')
          .attr('y', 0)
          .attr('x', function(d) { return x(d[0]); })
          .attr('height', boxHeight)
          .attr('width', function(d) { return x(d[2]) - x(d[0]); });

        box.transition()
          .attr('x', function(d) { return x(d[0]); })
          .attr('height', boxHeight)
          .attr('width', function(d) { return x(d[2]) - x(d[0]); });

        // Update median line.
        var medianLine = boxGroup.selectAll('line.median')
          .data([quartileData[1]]);

        medianLine.enter().append('line')
          .attr('class', 'median')
          .attr('x1', x)
          .attr('y1', 0)
          .attr('x2', x)
          .attr('y2', boxHeight);

        medianLine.transition()
          .attr('x1', x)
          .attr('x2', x)
          .attr('y2', boxHeight);

        // Update whiskers.
        var whisker = boxGroup.selectAll('line.whisker')
          .data(whiskerData || []);

        whisker.enter().append('line')
          .attr('class', 'whisker')
          .attr('x1', x)
          .attr('y1', 0)
          .attr('x2', x)
          .attr('y2', boxHeight);

        whisker.transition()
          .attr('x1', x)
          .attr('x2', x)
          .attr('y2', boxHeight);

        // Create the popover trigger.
        // A rectangle with no opacity.
        var trigger = g.selectAll('rect.trigger').data([d]);

        trigger.enter().append('rect')
          .attr('class', 'trigger')
          .attr('y', 0)
          .attr('x', 0)
          .attr('height', height)
          .attr('width', width)
          .attr('opacity', 0);

        trigger
          .attr('y', 0)
          .attr('x', 0)
          .attr('height', height)
          .attr('width', width);

        trigger.on('mouseover', function(d) {
          var matrix = this.getScreenCTM();

          var posX = (window.pageXOffset + matrix.e) + width/2;
          var posY =  (window.pageYOffset + matrix.f);

          chartPopover.setContent(
            <div>
              min: {d.whisker1}<br/>
              q1: {d.q1}<br/>
              median: {d.median}<br/>
              q3: {d.q3}<br/>
              max: {d.whisker2}
            </div>
          ).show(posX, posY);
        });

        trigger.on('mouseout', function(d) {
          chartPopover.hide();
        });

      });
    }

    box.width = function(x) {
      if (!arguments.length) {
        return width;
      }
      width = x;
      return box;
    };

    box.height = function(x) {
      if (!arguments.length) {
        return height;
      }
      height = x;
      return box;
    };

    box.tickFormat = function(x) {
      if (!arguments.length) {
        return tickFormat;
      }
      tickFormat = x;
      return box;
    };

    box.duration = function(x) {
      if (!arguments.length) {
        return duration;
      }
      duration = x;
      return box;
    };

    box.domain = function(x) {
      if (!arguments.length) {
        return domain;
      }
      domain = x == null ? x : d3.functor(x);
      return box;
    };

    box.value = function(x) {
      if (!arguments.length) {
        return value;
      }
      value = x;
      return box;
    };

    return box;
  };

  this._init = function() {
    this._calcSize();
    // The svg.
    svg = this.$el.append('svg')
        .attr('class', 'chart');

    // X scale. Range updated in function.
    x = d3.scale.linear();

    // Define xAxis function.
    xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    // Chart elements
    dataCanvas = svg.append("g")
        .attr('class', 'data-canvas')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
      .attr("class", "x axis")
      .append("text")
      .attr("class", "label")
      .attr("text-anchor", "end");

    boxChart = this._box();

  };

  this.update = function() {
    this._calcSize();

    var n = this.data.length;
    var domain = this.xData.domain;

    // Compute the size of each box.
    boxSize = 48;
    _height = (boxSize + margin.gap) * n;

    // Update axis.
    xAxis.tickValues(domain);

    boxChart
      .width(_width)
      .height(boxSize)
      .domain(domain);

    x.range([0, _width])
      .domain(domain);

    svg
      .attr('width', _width + margin.left + margin.right)
      .attr('height', _height + margin.top + margin.bottom);

    dataCanvas
      .attr('width', _width)
      .attr('height', _height);

    var boxes = dataCanvas.selectAll("g.boxplot-container")
      .data(this.data);

    boxes.enter().append('g')
      .attr("transform", function(d, i) { return "translate(" +  0  + "," + i * (boxSize + margin.gap) + ")"; })
      .call(boxChart);

    boxes
      .attr("transform", function(d, i) { return "translate(" +  0  + "," + i * (boxSize + margin.gap) + ")"; })
      .call(boxChart);

    boxes.exit().remove();

    // Append Axis.
    svg.select(".x.axis")
      .attr("transform", "translate(" + margin.left + "," + (_height + margin.top) + ")").transition()
      .call(xAxis);

    if (this.xData) {
      svg.select(".x.axis .label")
        .text(this.xData.label)
        .transition()
        .attr("x", _width + margin.right)
        .attr("y", 30);
    }

  };

  this.destroy = function() {

  };

  //--------------------------------------------------------------------------//
  // 3... 2... 1... GO...

  this._init();
  this.setData(data);
};

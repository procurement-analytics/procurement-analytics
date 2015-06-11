'use strict';
var React = require('react/addons');
var d3 = require('d3');
var _ = require('lodash');

var BoxChart = module.exports = React.createClass({
  chart: null,

  onWindowResize: function() {
    console.log('resize!');
    this.chart.update();
  },

  componentDidMount: function() {
    console.log('BoxChart componentDidMount');
    // Debounce event.
    this.onWindowResize = _.debounce(this.onWindowResize, 200);

    window.addEventListener('resize', this.onWindowResize);
    this.chart = new d3BoxChart(this.getDOMNode(), this.props.data);
  },

  componentWillUnmount: function() {
    console.log('BoxChart componentWillUnmount');
    window.removeEventListener('resize', this.onWindowResize);
    this.chart.destroy();
  },

  componentDidUpdate: function(/*prevProps, prevState*/) {
    console.log('BoxChart componentDidUpdate');
    this.chart.setData(this.props.data);
  },

  render: function() {
    return (
      <div className="boxChart"></div>
    );
  }
});




var d3BoxChart = function(el, data) {
  this.$el = d3.select(el);

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

  this._calcSize = function() {
    _width = parseInt(this.$el.style('width'), 10) - margin.left - margin.right;
    _height = parseInt(this.$el.style('height'), 10) - margin.top - margin.bottom;
    console.log('_calcSize', _width, 'w');
    console.log('_calcSize', _height, 'h');
  };

  this.setData = function(data) {
    this.data = data;
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
        var g = d3.select(this).attr('class', 'boxplot');
        var min = d.min;
        var max = d.max;

        var whiskerData = [d.whisker1, d.whisker2];
        var quartileData = [d.q1, d.median, d.q3];

        // Compute the x-scale.
        var x = d3.scale.linear()
            .domain(domain && domain.call(this, d, i) || [min, max])
            .range([0, width]);

        // Note: the box, median, and box tick elements are fixed in number,
        // so we only have to handle enter and update. In contrast, the outliers
        // and other elements are variable, so we need to exit them!
        // (Except this is a static chart, so no transitions, so no exiting)

        // Update center line: the horizontal line spanning the whiskers.
        var center = g.selectAll('line.center')
            .data([whiskerData]);

        center.enter().insert('line', 'rect')
          .attr('class', 'center')
          .attr('x1', function(d) { return x(d[0]); })
          .attr('y1', height / 2)
          .attr('x2', function(d) { return x(d[1]); })
          .attr('y2', height / 2);

        center
          .attr('y1', height / 2)
          .attr('x1', function(d) { return x(d[0]); })
          .attr('y2', height / 2)
          .attr('x2', function(d) { return x(d[1]); });

        // Update innerquartile box.
        var box = g.selectAll('rect.box')
          .data([quartileData]);

        box.enter().append('rect')
          .attr('class', 'box')
          .attr('y', 0)
          .attr('x', function(d) { return x(d[0]); })
          .attr('height', height)
          .attr('width', function(d) { return x(d[2]) - x(d[0]); });

        box
          .attr('x', function(d) { return x(d[0]); })
          .attr('height', height)
          .attr('width', function(d) { return x(d[2]) - x(d[0]); });

        // Update median line.
        var medianLine = g.selectAll('line.median')
          .data([quartileData[1]]);

        medianLine.enter().append('line')
          .attr('class', 'median')
          .attr('x1', x)
          .attr('y1', 0)
          .attr('x2', x)
          .attr('y2', height);

        medianLine
          .attr('x1', x)
          .attr('x2', x)
          .attr('y2', height);

        // Update whiskers.
        var whisker = g.selectAll('line.whisker')
          .data(whiskerData || []);

        whisker.enter().append('line')
          .attr('class', 'whisker')
          .attr('x1', x)
          .attr('y1', 0)
          .attr('x2', x)
          .attr('y2', height);

        whisker
          .attr('x1', x)
          .attr('x2', x)
          .attr('y2', height);
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
    // The svg
    svg = this.$el.append('svg');
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
      .attr("class", "x axis");

    boxChart = this._box()
      .width(_width);

  };

  this.update = function() {
    this._calcSize();

    var n = this.data.length;
    min = d3.min(this.data, function(v) { return v.min; });
    max = d3.max(this.data, function(v) { return v.max; });
    // Compute the size of each box.
    boxSize = (_height - n * margin.gap) / n;

    boxChart
      .height(boxSize)
      .domain([min, max]);

    x.range([0, _width])
      .domain([min, max]);

    svg
      .attr('width', _width + margin.left + margin.right)
      .attr('height', _height + margin.top + margin.bottom);

    dataCanvas
      .attr('width', _width)
      .attr('height', _height);

    var boxes = dataCanvas.selectAll("g.boxplot")
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
      .attr("transform", "translate(" + margin.left + "," + (_height + 32) + ")").transition() 
      .call(xAxis);

  };

  this.destroy = function() {

  };

  //--------------------------------------------------------------------------//
  // 3... 2... 1... GO...

  this._init();
  this.setData(data);
};





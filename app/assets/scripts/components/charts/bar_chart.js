'use strict';
var React = require('react/addons');
var d3 = require('d3');
var _ = require('lodash');

var BarChart = module.exports = React.createClass({
  chart: null,

  onWindowResize: function() {
    console.log('resize!');
    this.chart.update();
  },

  componentDidMount: function() {
    console.log('BarChart componentDidMount');
    // Debounce event.
    this.onWindowResize = _.debounce(this.onWindowResize, 200);

    window.addEventListener('resize', this.onWindowResize);
    this.chart = new d3BarChart(this.getDOMNode(), this.props.data);
  },

  componentWillUnmount: function() {
    console.log('BarChart componentWillUnmount');
    window.removeEventListener('resize', this.onWindowResize);
    this.chart.destroy();
  },

  componentDidUpdate: function(/*prevProps, prevState*/) {
    console.log('BarChart componentDidUpdate');
    this.chart.setData(this.props.data);
  },

  render: function() {
    return (
      <div className="barChart"></div>
    );
  }
});




var d3BarChart = function(el, data) {
  this.$el = d3.select(el);

  // Var declaration.
  var margin = {top: 30, right: 32, bottom: 50, left: 50};
  // width and height refer to the data canvas. To know the svg size the margins
  // must be added.
  var _width, _height;
  // Scales, Axis, and line functions.
  var x, y, xBar, xAxis, yAxis, line;
  // Elements.
  var svg, dataCanvas;

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

  this._init = function() {
    this._calcSize();
    // The svg
    svg = this.$el.append('svg');
    // X scale. Range updated in function.
    x = d3.scale.ordinal();
    xBar = d3.scale.ordinal();

    // Y scale. Range updated in function.
    y = d3.scale.linear();

    // Define xAxis function.
    xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    // Define yAxis function.
    yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    // Line function
    line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.count); });

    // Chart elements

    dataCanvas = svg.append("g")
        .attr('class', 'data-canvas')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
      .attr("class", "x axis")
      .append("text")
      .attr("class", "label")
      .attr("text-anchor", "end");

    svg.append("g")
      .attr("class", "y axis")
      .append("text")
      .attr("class", "label")
      .attr("text-anchor", "middle");
  };

  this.update = function() {
    this._calcSize();

    // Create the buckets.
    var buckets = d3.range(this.data.x.min, this.data.x.max, (this.data.x.max - this.data.x.min) / this.data.buckets.length);

    xBar.rangeBands([0, _width])
      .domain(buckets);

    // For the range points we need the max value as well.
    x.rangePoints([0, _width])
      .domain(buckets.concat([this.data.x.max]));

    y.range([_height, 0])
      .domain([this.data.y.min, this.data.y.max]);

    svg
      .attr('width', _width + margin.left + margin.right)
      .attr('height', _height + margin.top + margin.bottom);

    dataCanvas
      .attr('width', _width)
      .attr('height', _height);

    var data = this.data.buckets.map(function(o) { return [o]; });

    var barG = dataCanvas.selectAll(".bar")
      .data(data);

    barG.enter()
      .append("g")
        .attr("class", "bar")
        .attr("transform", function(d, i) { return "translate(" + i * xBar.rangeBand() + "," + 0 + ")"; })
        .append("rect")
          .attr("y", function(d) { return y(d); })
          .attr("height", function(d) { return _height - y(d); })
          .attr("width", xBar.rangeBand());

    barG
      .attr("transform", function(d, i) { return "translate(" + i * xBar.rangeBand() + "," + 0 + ")"; })
      .select('rect')
        .attr("y", function(d) { return y(d); })
        .attr("height", function(d) { return _height - y(d); })
        .attr("width", xBar.rangeBand());

    // Append Axis.
    svg.select(".x.axis")
      .attr("transform", "translate(" + margin.left + "," + (_height + 32) + ")").transition()
      .call(xAxis);

    if (this.data.x.label) {
      svg.select(".x.axis .label")
        .text(this.data.x.label)
        .transition()
        .attr("x", _width + margin.right)
        .attr("y", 30);
    }

    svg.select(".y.axis")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")").transition()
      .call(yAxis);

    if (this.data.y.label) {
      svg.select(".y.axis .label")
        .text(this.data.y.label)
        .transition()
        .attr("x", 0)
        .attr("y", -15);
    }

    console.log(this.$el);
  };

  this.destroy = function() {

  };

  //--------------------------------------------------------------------------//
  // 3... 2... 1... GO...

  this._init();
  this.setData(data);
};


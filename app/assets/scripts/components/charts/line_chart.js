'use strict';
var React = require('react/addons');
var d3 = require('d3');
var _ = require('lodash');

var LineChart = module.exports = React.createClass({
  chart: null,

  onWindowResize: function() {
    console.log('resize!');
    this.chart.update();
  },

  componentDidMount: function() {
    console.log('LineChart componentDidMount');
    // Debounce event.
    this.onWindowResize = _.debounce(this.onWindowResize, 200);

    window.addEventListener('resize', this.onWindowResize);
    this.chart = new d3LineChart(this.getDOMNode(), this.props);
  },

  componentWillUnmount: function() {
    console.log('LineChart componentWillUnmount');
    window.removeEventListener('resize', this.onWindowResize);
    this.chart.destroy();
  },

  componentDidUpdate: function(/*prevProps, prevState*/) {
    console.log('LineChart componentDidUpdate');
    this.chart.setData(this.props);
  },

  render: function() {
    return (
      <div className="lineChart"></div>
    );
  }
});




var d3LineChart = function(el, data) {
  this.$el = d3.select(el);

  this.data = null;
  this.xData = null;
  this.yData = null;

  // Var declaration.
  var margin = {top: 30, right: 32, bottom: 50, left: 50};
  // width and height refer to the data canvas. To know the svg size the margins
  // must be added.
  var _width, _height;
  // Scales, Axis, and line functions.
  var x, y, xAxis, yAxis, line;
  // Elements.
  var svg, dataCanvas;

  this._calcSize = function() {
    _width = parseInt(this.$el.style('width'), 10) - margin.left - margin.right;
    _height = parseInt(this.$el.style('height'), 10) - margin.top - margin.bottom;
    console.log('_calcSize', _width, 'w');
    console.log('_calcSize', _height, 'h');
  };

  this.setData = function(data) {
    console.log('data', data);
    this.data = data.data;
    this.xData = data.x;
    this.yData = data.y;
    this.update();
  };

  this._init = function() {
    this._calcSize();
    // The svg
    svg = this.$el.append('svg');
    // X scale. Range updated in function.
    x = d3.scale.ordinal();

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
      .y(function(d) { return y(d.value); });

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

    dataCanvas.append("path")
      .attr("class", "line");
  };

  this.update = function() {
    this._calcSize();

    x.rangePoints([0, _width])
      .domain(this.data.map(function(d) { return d.date; }));

    y.range([_height, 0])
      .domain(this.yData.domain);

    svg
      .attr('width', _width + margin.left + margin.right)
      .attr('height', _height + margin.top + margin.bottom);

    dataCanvas
      .attr('width', _width)
      .attr('height', _height);


    var path = dataCanvas.select(".line")
      .datum(this.data)
      .attr("d", line);
/*
    var totalLength = path.node().getTotalLength();

    path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
        .duration(1000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);
*/

    // Append Axis.
    svg.select(".x.axis")
      .attr("transform", "translate(" + margin.left + "," + (_height + 32) + ")").transition()
      .call(xAxis);

    if (this.xData && this.xData.label) {
      svg.select(".x.axis .label")
        .text(this.xData.label)
        .transition()
        .attr("x", _width + margin.right)
        .attr("y", 30);
    }

    svg.select(".y.axis")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")").transition()
      .call(yAxis);

    if (this.yData && this.yData.label) {
      svg.select(".y.axis .label")
        .text(this.yData.label)
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


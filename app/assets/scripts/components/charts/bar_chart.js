'use strict';
var React = require('react/addons');
var d3 = require('d3');
var _ = require('lodash');
var popover = require('./popover');

var BarChart = module.exports = React.createClass({
  chart: null,

  onWindowResize: function() {
    this.chart.update();
  },

  componentDidMount: function() {
    //console.log('BarChart componentDidMount');
    // Debounce event.
    this.onWindowResize = _.debounce(this.onWindowResize, 200);

    window.addEventListener('resize', this.onWindowResize);
    this.chart = new d3BarChart(this.getDOMNode(), this.props);
  },

  componentWillUnmount: function() {
    //console.log('BarChart componentWillUnmount');
    window.removeEventListener('resize', this.onWindowResize);
    this.chart.destroy();
  },

  componentDidUpdate: function(/*prevProps, prevState*/) {
    //console.log('BarChart componentDidUpdate');
    this.chart.setData(this.props);
  },

  render: function() {
    return (
      <div className="barChart"></div>
    );
  }
});

var d3BarChart = function(el, data) {
  this.$el = d3.select(el);

  this.data = null;
  this.xData = null;
  this.yData = null;

  // Var declaration.
  var margin = {top: 10, right: 32, bottom: 48, left: 32};
  // width and height refer to the data canvas. To know the svg size the margins
  // must be added.
  var _width, _height;
  // Scales, Axis, and line functions.
  var x, y, xBar, xAxis;
  // Elements.
  var svg, dataCanvas;
  // Init the popover.
  var chartPopover = new popover();

  this._calcSize = function() {
    _width = parseInt(this.$el.style('width'), 10) - margin.left - margin.right;
    _height = parseInt(this.$el.style('height'), 10) - margin.top - margin.bottom;
  };

  this.setData = function(data) {
    var _data = _.cloneDeep(data);
    this.data = _data;
    this.xData = _data.x;
    this.yData = _data.y;
    this.popoverContent = _data.popoverContentFn;
    this.update();
  };

  this._init = function() {
    this._calcSize();
    // The svg.
    svg = this.$el.append('svg')
        .attr('class', 'chart');

    // X scale. Range updated in function.
    x = d3.scale.ordinal();
    xBar = d3.scale.ordinal();

    // Y scale. Range updated in function.
    y = d3.scale.linear();

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

    svg.append("g")
      .attr("class", "y axis")
      .append("text")
      .attr("class", "label")
      .attr("text-anchor", "middle");
  };

  this.update = function() {
    this._calcSize();
    var _this = this;

    var yAxisGroup = svg.select('.y.axis');

    yAxisGroup.selectAll('.axis-lines')
      .data([
        {x1: 0, x2: _width + margin.left + margin.right, y1: 0.5, y2: 0.5},
        {x1: 0, x2: _width + margin.left + margin.right, y1: _height + margin.top + 10.5, y2: _height + margin.top + 10.5}
      ])
    .enter().append('line')
      .attr('class', 'axis-lines')
      .attr('x1', function(d) {return d.x1; })
      .attr('y1', function(d) {return d.y1; })
      .attr('x2', function(d) {return d.x2; })
      .attr('y2', function(d) {return d.y2; });

    yAxisGroup.selectAll('.axis-lines')
      .attr('x1', function(d) {return d.x1; })
      .attr('y1', function(d) {return d.y1; })
      .attr('x2', function(d) {return d.x2; })
      .attr('y2', function(d) {return d.y2; });

    yAxisGroup.selectAll('.label-min')
      .data([this.yData.domain[0]])
    .enter().append('text')
      .attr('class', 'label-min')
      .attr('x', 0)
      .attr('y', _height + margin.top)
      .text(function(d) {return d;});

    yAxisGroup.selectAll('.label-max')
      .data([this.yData.domain[1]])
    .enter().append('text')
      .attr('class', 'label-max')
      .attr('x', 0)
      .attr('y', 0)
      .attr('dy', '14px') // 14 is for the font size.
      .text(function(d) {return d;});

    // Create the buckets.
    var xDomain = this.xData.domain;
    var buckets = d3.range(xDomain[0], xDomain[1], (xDomain[1] - xDomain[0]) / this.data.data.length);
    var bucketsScale = buckets.concat([xDomain[1]]);

    xBar.rangeBands([0, _width])
      .domain(buckets);

    // For the range points we need the max value as well.
    x.rangePoints([0, _width])
      .domain(bucketsScale);

    y.range([_height, 0])
      .domain(this.yData.domain);

    svg
      .attr('width', _width + margin.left + margin.right)
      .attr('height', _height + margin.top + margin.bottom);

    dataCanvas
      .attr('width', _width)
      .attr('height', _height);

    var data = this.data.data.map(function(o) { return [o]; });

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
        .transition()
        .attr("y", function(d) { return y(d); })
        .attr("height", function(d) { return _height - y(d); })
        .attr("width", xBar.rangeBand());


    barG.on('mouseover', function(d, i) {
      var matrix = this.getScreenCTM();

      var posX = (window.pageXOffset + matrix.e) + xBar.rangeBand()/2;
      var posY =  (window.pageYOffset + matrix.f) + _height / 2;

      chartPopover.setContent(_this.popoverContent(d, i, {buckets: bucketsScale})).show(posX, posY);
    });

    barG.on('mouseout', function(d) {
      chartPopover.hide();
    });

    // Append Axis.
    svg.select(".x.axis")
      .attr("transform", "translate(" + margin.left + "," + (_height + margin.top + 10) + ")").transition()
      .call(xAxis);

    if (this.data.x.label) {
      svg.select(".x.axis .label")
        .text(this.xData.label)
        .attr("x", _width / 2)
        .attr("y", 35);
    }

    if (this.data.y.label) {
      svg.select(".y.axis .label")
        .text(this.yData.label)
        .attr('x', -(_height / 2 + margin.top))
        .attr('y', 10)
        .attr('transform', 'rotate(-90)');
    }

  };

  this.destroy = function() {

  };

  //--------------------------------------------------------------------------//
  // 3... 2... 1... GO...
  this._init();
  this.setData(data);
};


'use strict';
var React = require('react/addons');
var d3 = require('d3');
var _ = require('lodash');
var popover = require('./popover');

var LineChart = module.exports = React.createClass({
  chart: null,

  onWindowResize: function() {
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
  // Scales, Axis, line and area functions.
  var x, y, xAxis, yAxis, line, area;
  // Elements.
  var svg, dataCanvas;
  // Init the popover.
  var chartPopover = new popover();

  var parseDate = d3.time.format("%Y-%m-%d").parse;

  this._calcSize = function() {
    _width = parseInt(this.$el.style('width'), 10) - margin.left - margin.right;
    _height = parseInt(this.$el.style('height'), 10) - margin.top - margin.bottom;
  };

  this.setData = function(data) {
    var _data = _.cloneDeep(data);
    this.data = _data.data;
    this.xData = _data.x;
    this.yData = _data.y;

    this.data.forEach(function(d) {
      d.date = parseDate(d.date);
    });

    this.popoverContent = _data.popoverContentFn;

    this.update();
  };

  this._init = function() {
    this._calcSize();

    // The svg.
    svg = this.$el.append('svg')
        .attr('class', 'chart');

    // X scale. Range updated in function.
    x = d3.time.scale();

    // Y scale. Range updated in function.
    y = d3.scale.linear();

    // Define xAxis function.
    xAxis = d3.svg.axis()
      .scale(x)
      .ticks(6)
      .orient("bottom");

    // Define yAxis function.
    yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    // Line function.
    line = d3.svg.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.value); });

    // Area function.
    area = d3.svg.area()
      .x(function(d) { return x(d.date); })
      .y0(function(d) { return y(d.value); })
      .y1(function(d) { return _height; });

    // Chart elements.
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
      .attr("class", "area");

    dataCanvas.append("path")
      .attr("class", "line");

    dataCanvas.append("g")
      .attr("class", "focus-circles");
  };

  this.update = function() {
    this._calcSize();
    var _this = this;

    x.range([0, _width])
      .domain(d3.extent(this.data, function(d) { return d.date; }));
      //.domain(this.data.map(function(d) { return d.date; }));

    y.range([_height, 0])
      .domain(this.yData.domain);

    svg
      .attr('width', _width + margin.left + margin.right)
      .attr('height', _height + margin.top + margin.bottom);

    dataCanvas
      .attr('width', _width)
      .attr('height', _height);

    var pathLine = dataCanvas.select(".line")
      .datum(this.data)
      .attr("d", line);

    var pathArea = dataCanvas.select(".area")
      .datum(this.data)
      .attr("d", area);

    var focusCirlces = dataCanvas.select(".focus-circles").selectAll('.focus-circle')
      .data(this.data);

    focusCirlces.enter()
      .append('circle')
      .attr('class', 'focus-circle')
      .attr('cx', function(d) { return x(d.date);})
      .attr('cy', function(d) { return y(d.value);})
      .style('opacity', 0)
      .attr('r', 6);

    focusCirlces
      .attr('cx', function(d) { return x(d.date);})
      .attr('cy', function(d) { return y(d.value);})
      .style('opacity', 0)
      .attr('r', 6);

    focusCirlces.exit()
      .remove();

    focusCirlces
      .on("mouseover", function(d, i) {
        var cr = d3.select(this);
        cr.transition().attr('r', 8).style('opacity', 1);

        var matrix = this.getScreenCTM()
          .translate(this.getAttribute("cx"), this.getAttribute("cy"));
        
        var posX = window.pageXOffset + matrix.e;
        var posY =  window.pageYOffset + matrix.f;

        chartPopover.setContent(_this.popoverContent(d, i)).show(posX, posY);

      })
      .on("mouseout", function() {
        d3.select(this).transition().attr('r', 6).style('opacity', 0 );
        chartPopover.hide();
      });

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

  };

  this.destroy = function() {

  };

  //--------------------------------------------------------------------------//
  // 3... 2... 1... GO...

  this._init();
  this.setData(data);
};

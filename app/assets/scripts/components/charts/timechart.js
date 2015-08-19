'use strict';
var React = require('react/addons');
var d3 = require('d3');
var _ = require('lodash');
var popover = require('./popover');

var TimeChart = module.exports = React.createClass({
  chart: null,

  onWindowResize: function() {
    this.chart.update();
  },

  componentDidMount: function() {
    this.onWindowResize = _.debounce(this.onWindowResize, 200);
    window.addEventListener('resize', this.onWindowResize);
    this.chart = new d3TimeChart(this.getDOMNode(), this.props);
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.onWindowResize);
    this.chart.destroy();
  },

  componentDidUpdate: function() {
    this.chart.setData(this.props);
  },

  render: function() {
    return (
      <div className="timeChart"></div>
    );
  }

});

var d3TimeChart = function(el, data) {
  this.$el = d3.select(el);

  this.data = null;
  this.xData = null;
  this.yData = null;

  // Var declaration.
  var margin = {top: 0, right: 32, bottom: 48, left: 32};
  // width and height refer to the data canvas. To know the svg size the margins
  // must be added.
  var _width, _height;
  // Scales functions.
  var x, xAxis, band;
  // Elements.
  var svg, dataCanvas, rows;
  // Init the popover.
  var chartPopover = new popover();

  this._calcSize = function() {
    _width = parseInt(this.$el.style('width'), 10) - margin.left - margin.right;
    // _height will be calculated after.
    //_height = /*parseInt(this.$el.style('height'), 10)*/ 300 - margin.top - margin.bottom;
  };

  this.setData = function(data) {
    var _data = _.cloneDeep(data);
    this.data = _data.data;
    this.xData = _data.x;
    this.yData = _data.y;
    this.popoverContent = _data.popoverContentFn;
    this.update();
  };

  this._init = function() {
    this._calcSize();
    svg = this.$el.append('svg')
        .attr('class', 'chart');

    x = d3.scale.linear();

    // Define xAxis function.
    xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    dataCanvas = svg.append("g")
      .attr('class', 'data-canvas')
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
      .attr("class", "x axis")
      .append("text")
        .attr("class", "label")
        .attr("text-anchor", "middle");

    svg.append("g")
      .attr("class", "legend")
  };


  // Construct a stacked bar array.
  this.stack = function(arr) {
    _.each(arr, function(rows) {
      var total = 0;
      rows.d = _.map(rows.data, function(d) {
        var val = {
          x: x(total),
          width: ((x(d) > 0) ? x(d) : 0),
          val: d,
          //sum: total + d
        };
        if (d > 0) {
          total += d;
        }
        return val;
      });
    });
    return arr;
  };


  this.update = function() {
    this._calcSize();
    var _this = this;

    var max = d3.max(_.map(this.data, function(d) {
      return d.data.reduce(function(a, b) {
        return a + b;
      }, 0);
    }));

    x.range([0, _width])
      .domain([0, max]);

    //band = Math.floor(_height / this.data.length);
    // Each band has a fixed size and the chart grows based on that.
    band = 80;
    _height = band * this.data.length;
    var legendItemHeight = 24;
    var legendBlockHeight = legendItemHeight * this.xData.bands.length;

    svg
      .attr('width', _width + margin.left + margin.right)
      .attr('height', _height + margin.top + margin.bottom + legendBlockHeight);

    dataCanvas
      .attr('width', _width)
      .attr('height', _height);

    // Bottom line.
    svg.selectAll('.axis-lines')
      .data([
        {x1: 0, x2: _width + margin.left + margin.right, y1: _height + margin.top + 0.5, y2: _height + margin.top + 0.5}
      ])
    .enter().append('line')
      .attr('class', 'axis-lines')
      .attr('x1', function(d) { return d.x1; })
      .attr('y1', function(d) { return d.y1; })
      .attr('x2', function(d) { return d.x2; })
      .attr('y2', function(d) { return d.y2; });

    svg.selectAll('.axis-lines')
      .attr('x1', function(d) { return d.x1; })
      .attr('y1', function(d) { return d.y1; })
      .attr('x2', function(d) { return d.x2; })
      .attr('y2', function(d) { return d.y2; });

    // Legend block.
    var legend = svg.select('.legend')
      .attr("transform", "translate(0," + (_height + margin.top + 48) + ")");

    var legendItem = legend.selectAll('.legend-item')
      .data(this.xData.bands)
    .enter().append('g')
      .attr('class', function(d, i) { return 'legend-item color-phase-' + (i + 1); })
      .attr("transform", function(d, i) { return "translate(0," + (i * legendItemHeight) + ")"; });

    legendItem.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 16)
      .attr('height', 16);

    legendItem.append('text')
      .attr('x', 24)
      .attr('y', 0)
      .attr('dy', 13)
      .text(function(d) { return d; });

    // END Legend block

    var stack = this.stack(this.data);

    rows = dataCanvas.selectAll('.time-row')
      .data(stack);

    rows.enter()
      .append('g')
      .attr('class', 'time-row')
      .attr('transform', function(d, i) { return 'translate(0,' + i * band + ')'; });

    rows.exit().remove();

    rows.selectAll('.small-label')
      .data(function(d) { return [d.label] })
      .enter()
    .append('text')
      .attr('class', 'small-label')
      .text(function(d) { return d })
      .attr('x', 0)
      .attr('y', 14);

    rows.selectAll('.small-label')
      .text(function(d) { return d });

    rows.selectAll('.bar')
      .data(function(d) { return d.d; })
    .enter().append('rect')
      .attr('class', function(d, i) { return 'bar color-phase-' + (i + 1); })
      .attr('x', function(d) { return d.x })
      .attr('width', function(d) { return d.width; })
      .attr('y', 20)
      .attr('height', band * .5);

    rows.selectAll('.bar')
      .transition()
      .attr('x', function(d) { return d.x })
      .attr('width', function(d) { return d.width; })
      .attr('y', 20)
      .attr('height', band * .5);

    rows.selectAll('.bar-tick')
      .data(function(d) { return d.d; })
    .enter().append('text')
      .attr('class', 'bar-tick')
      .attr('x', function(d) { return d.x + d.width / 2 })
      .attr('y', band * .25 + 20)
      .attr('dy', '6px')
      .text(function(d, i) { return d.val });

    rows.selectAll('.bar-tick')
      .transition()
      .attr('x', function(d) { return d.x + d.width / 2 })
      .attr('y', band * .25 + 20);
/*
    rows.selectAll('.bar-axis-tick')
      .data(function(d) { return [{sum: 0, x: 0, width: 0 }].concat(d.d); })
    .enter().append('text')
      .attr('class', 'bar-axis-tick')
      .attr('x', function(d) { return d.x + d.width})
      .attr('y', band * .5 + 20)
      .attr('dy', '12px')
      .text(function(d, i) { return d.sum });

    rows.selectAll('.bar-axis-tick')
      .transition()
      .attr('x', function(d) { return d.x + d.width})
      .attr('y', band * .5 + 20);
*/
    rows.selectAll('.trigger')
      .data(function(d) {
        var data = _.omit(d, 'd');
        var dlast = d.d[d.d.length - 1]
        data.x = d.d[0].x;
        data.width = dlast.x + dlast.width;
        return [data];
      })
    .enter().append('rect')
      .attr('class', 'trigger')
      .attr('x', function(d) { return d.x })
      .attr('width', function(d) { return d.width; })
      .attr('y', 20)
      .attr('height', band * .5)
      .style('opacity', 0);

    rows.selectAll('.trigger')
      .transition()
      .attr('x', function(d) { return d.x })
      .attr('width', function(d) { return d.width; })
      .attr('y', 20)
      .attr('height', band * .5);

    rows.selectAll('.trigger')
      .on("mouseover", function(d, i) {
          // Returns the position of the group.
          var matrix = this.getScreenCTM();

          var posX = (window.pageXOffset + matrix.e) + d.width/2;
          var posY =  (window.pageYOffset + matrix.f) + 20;

          chartPopover.setContent(_this.popoverContent(_.omit(d, ['width', 'x']), i, {bands: _this.xData.bands})).show(posX, posY);
      })
      .on("mouseout", function() {
        chartPopover.hide();
      });

    // Append Axis.
    svg.select(".x.axis")
      .attr("transform", "translate(" + margin.left + "," + (_height + margin.top) + ")").transition()
      .call(xAxis);

    if (this.xData && this.xData.label) {
      svg.select(".x.axis .label")
        .text(this.xData.label)
        .attr("x", _width / 2)
        .attr("y", 35);
    }
  };

  this.destroy = function() {

  };

  //--------------------------------------------------------------------------//
  // 3... 2... 1... GO...
  this._init();
  this.setData(data);
};

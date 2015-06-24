'use strict';
var React = require('react/addons');
var d3 = require('d3');
var _ = require('lodash');

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

  var margin = {top: 5, right: 15, bottom: 15, left: 70};
  var _width, _height;
  var x, band;
  var svg, dataCanvas, rows;

  var baseColor = d3.rgb(30, 137, 111);

  this._calcSize = function() {
    _width = parseInt(this.$el.style('width'), 10) - margin.left - margin.right;
    _height = /*parseInt(this.$el.style('height'), 10)*/ 300 - margin.top - margin.bottom;
  };

  this.setData = function(data) {
    var d = _.cloneDeep(data);
    this.data = d.data;
    this.xData = d.x;
    this.yData = d.y;
    this.update();
  };

  this._init = function() {
    this._calcSize();
    svg = this.$el.append('svg');

    x = d3.scale.linear();

    dataCanvas = svg.append("g")
      .attr('class', 'data-canvas')
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  };

  // Construct a stacked bar array.
  this.stack = function(arr) {
    _.each(arr, function(rows) {
      var total = 0;
      rows.d = _.map(rows.data, function(d) {
        var val = {
          x: x(total),
          width: x(d),
          val: d,
          sum: total + d
        };
        total += d;
        return val;
      });
    });
    return arr;
  };

  this.update = function() {
    this._calcSize();

    var max = d3.max(_.map(this.data, function(d) { return d.data.reduce(function(a, b) {
      return a + b;
    })}));
    x.range([0, _width])
      .domain([0, max]);

    band = Math.floor(_height / this.data.length);
    console.log(band);

    svg
      .attr('width', _width + margin.left + margin.right)
      .attr('height', _height + margin.top + margin.bottom);

    dataCanvas
      .attr('width', _width)
      .attr('height', _height);

    var stack = this.stack(this.data);

    // Make sure we always end up at the base color
    var color = baseColor.brighter((stack[0].d.length - 1) * .3);

    rows = dataCanvas.selectAll('.row')
      .data(stack);

    rows.enter()
      .append('g')
      .attr('class', 'row')
      .attr('transform', function(d, i) { return 'translate(0,' + i*band + ')'; });

    rows.selectAll('.small-label')
      .data(function(d) { return [d.label.toUpperCase()] })
      .enter()
    .append('text')
      .attr('class', 'small-label')
      .style('text-anchor', 'end')
      .text(function(d) { return d })
      .attr('x', '-10px')
      .attr('y', band * .25)
      .attr('dy', '6px');

    rows.selectAll('.bar')
      .data(function(d) { return d.d; })
    .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', function(d) { return d.x })
      .attr('width', function(d) { return d.width; })
      .attr('y', 0)
      .attr('height', band * .5)
      .style('fill', function(d, i) { return color.darker(i * .3).toString(); });

    rows.selectAll('.bar')
      .transition()
      .attr('x', function(d) { return d.x })
      .attr('width', function(d) { return d.width; })
      .attr('y', 0)
      .attr('height', band * .5)
      .style('fill', function(d, i) { return color.darker(i * .3).toString(); });

    rows.selectAll('.bar-tick')
      .data(function(d) { return d.d; })
    .enter().append('text')
      .attr('class', 'bar-tick')
      .attr('x', function(d) { return d.x + d.width / 2 })
      .attr('y', band * .25)
      .attr('dy', '6px')
      .text(function(d, i) { return i+1 });

    rows.selectAll('.bar-tick')
      .transition()
      .attr('x', function(d) { return d.x + d.width / 2 })
      .attr('y', band * .25);

    rows.selectAll('.bar-axis-tick')
      .data(function(d) { return [{sum: 0, x: 0, width: 0 }].concat(d.d); })
    .enter().append('text')
      .attr('class', 'bar-axis-tick')
      .attr('x', function(d) { return d.x + d.width})
      .attr('y', band * .5)
      .attr('dy', '12px')
      .text(function(d, i) { return d.sum });

    rows.selectAll('.bar-axis-tick')
      .transition()
      .attr('x', function(d) { return d.x + d.width})
      .attr('y', band * .5);
  };

  this.destroy = function() {};

  this._init();
  this.setData(data);
};
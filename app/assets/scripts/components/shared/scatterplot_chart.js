'use strict';
var React = require('react/addons');
var d3 = require('d3');
var _ = require('lodash');

var ScatterplotChart = module.exports = React.createClass({
  chart: null,

  onWindowResize: function() {
    console.log('resize!');
    this.chart.update();
  },

  componentDidMount: function() {
    console.log('ScatterplotChart componentDidMount');
    // Debounce event.
    this.onWindowResize = _.debounce(this.onWindowResize, 200);

    window.addEventListener('resize', this.onWindowResize);
    this.chart = new d3ScatterplotChart(this.getDOMNode(), this.props.data);
  },

  componentWillUnmount: function() {
    console.log('ScatterplotChart componentWillUnmount');
    window.removeEventListener('resize', this.onWindowResize);
    this.chart.destroy();
  },

  componentDidUpdate: function(/*prevProps, prevState*/) {
    console.log('ScatterplotChart componentDidUpdate');
    this.chart.setData(this.props.data);
  },

  render: function() {
    return (
      <div className="scatterplotChart"></div>
    );
  }
});




var d3ScatterplotChart = function(el, data) {
  this.$el = d3.select(el);

  // Var declaration.
  var margin = {top: 30, right: 32, bottom: 50, left: 50};
  // width and height refer to the data canvas. To know the svg size the margins
  // must be added.
  var _width, _height;
  // Scales and Axis functions.
  var x, y, r, xAxis, yAxis;
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

  // returns slope, intercept and r-square of the line
  this.leastSquares = function(xSeries, ySeries) {
    var reduceSumFunc = function(prev, cur) { return prev + cur; };
    
    var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
    var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

    var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
      .reduce(reduceSumFunc);
    
    var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
      .reduce(reduceSumFunc);
      
    var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
      .reduce(reduceSumFunc);
      
    var slope = ssXY / ssXX;
    var intercept = yBar - (xBar * slope);
    var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
    
    return [slope, intercept, rSquare];
  };

  this._init = function() {
    this._calcSize();
    // The svg
    svg = this.$el.append('svg');
    // X scale. Range/Domain updated in function.
    x = d3.scale.linear();

    // Y scale. Range/Domain updated in function.
    y = d3.scale.linear();

    // R scale. Domain updated in function.
    r = d3.scale.linear().range([2, 10]);

    // Define xAxis function.
    xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    // Define yAxis function.
    yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    // Chart elements
    dataCanvas = svg.append("g")
        .attr('class', 'data-canvas')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
      .attr("class", "x axis");

    svg.append("g")
      .attr("class", "y axis");

  };

  this.update = function() {
    this._calcSize();

    // Add some padding to the axes.
    // 1/10th of the difference between min and max.
    // Do not allow to fall below 0.
    var xd = [d3.min(this.data, function(d) { return d.amount; }), d3.max(this.data, function(d) { return d.amount; })];
    xd[0] -= (xd[1] - xd[0]) / 10;
    xd[0] = xd[0] < 0 ? 0 : xd[0];
    xd[1] += (xd[1] - xd[0]) / 10;

    x.range([0, _width]).domain(xd);

    // Add some padding to the axes.
    // 1/10th of the difference between min and max.
    // Do not allow to fall below 0.
    var yd = [d3.min(this.data, function(d) { return d.suppliers; }), d3.max(this.data, function(d) { return d.suppliers; })]
    yd[0] -= (yd[1] - yd[0]) / 10;
    yd[0] = yd[0] < 0 ? 0 : yd[0];
    yd[1] += (yd[1] - yd[0]) / 10;

    y.range([_height, 0]).domain(yd);

    r.domain([d3.min(this.data, function(d) { return d.contracts; }), d3.max(this.data, function(d) { return d.contracts; })]);

    svg
      .attr('width', _width + margin.left + margin.right)
      .attr('height', _height + margin.top + margin.bottom);

    dataCanvas
      .attr('width', _width)
      .attr('height', _height);

    // Calc the linear regression.
    var leastSquaresCoeff = this.leastSquares(_.pluck(this.data, 'amount'), _.pluck(this.data, 'suppliers'));
    var x1 = xd[0];
    var x2 = xd[1];
    //y = mx + b
    var y1 = leastSquaresCoeff[0] * x1 + leastSquaresCoeff[1];
    var y2 = leastSquaresCoeff[0] * x2 + leastSquaresCoeff[1];
    
    var trendline = dataCanvas.selectAll(".trendline")
      .data([[x1,y1,x2,y2]]);
    
    trendline.enter().append("line")
      .attr("class", "trendline")
      .attr("x1", function(d) { return x(d[0]); })
      .attr("y1", function(d) { return y(d[1]); })
      .attr("x2", function(d) { return x(d[2]); })
      .attr("y2", function(d) { return y(d[3]); });

    trendline
      .attr("x1", function(d) { return x(d[0]); })
      .attr("y1", function(d) { return y(d[1]); })
      .attr("x2", function(d) { return x(d[2]); })
      .attr("y2", function(d) { return y(d[3]); });


    var circles = dataCanvas.selectAll('circle.dot')
      .data(this.data);

    circles.enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d) { return r(d.contracts); })
      .attr("cx", function(d) { return x(d.amount); })
      .attr("cy", function(d) { return y(d.suppliers); })

    circles
      .attr("r", function(d) { return r(d.contracts); })  
      .attr("cx", function(d) { return x(d.amount); })
      .attr("cy", function(d) { return y(d.suppliers); })

    // Append Axis.
    svg.select(".x.axis")
      .attr("transform", "translate(" + margin.left + "," + (_height + 32) + ")").transition() 
      .call(xAxis);

    svg.select(".y.axis")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")").transition() 
      .call(yAxis);
  };

  this.destroy = function() {

  };

  //--------------------------------------------------------------------------//
  // 3... 2... 1... GO...

  this._init();
  this.setData(data);
};
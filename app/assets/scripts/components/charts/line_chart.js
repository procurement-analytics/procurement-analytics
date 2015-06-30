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
    //console.log('LineChart componentDidMount');
    // Debounce event.
    this.onWindowResize = _.debounce(this.onWindowResize, 200);

    window.addEventListener('resize', this.onWindowResize);
    this.chart = new d3LineChart(this.getDOMNode(), this.props);
  },

  componentWillUnmount: function() {
    //console.log('LineChart componentWillUnmount');
    window.removeEventListener('resize', this.onWindowResize);
    this.chart.destroy();
  },

  componentDidUpdate: function(/*prevProps, prevState*/) {
    //console.log('LineChart componentDidUpdate');
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
  var margin = {top: 10, right: 32, bottom: 48, left: 32};
  // width and height refer to the data canvas. To know the svg size the margins
  // must be added.
  var _width, _height;
  // Scales, Axis, line and area functions.
  var x, y, xAxis, line, area, bisector;
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
    this.data.forEach(function(d) {
      d.date = parseDate(d.date);
    });
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
    x = d3.time.scale();

    // Y scale. Range updated in function.
    y = d3.scale.linear();

    // Bisector function.
    bisector = d3.bisector(function(d) { return d.date; }).left;

    // Define xAxis function.
    xAxis = d3.svg.axis()
      .scale(x)
      .ticks(6)
      .orient("bottom");

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
        .attr("text-anchor", "middle");

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

    yAxisGroup.selectAll('.label-min')
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

    yAxisGroup.selectAll('.label-max')
      .attr('x', 0)
      .attr('y', 0)
      .text(function(d) {return d;});

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

    pathArea.on("mousemove", function(d) {
      // Calculate index of the closest value.
      var mousex = x.invert(d3.mouse(this)[0]);
      var closestIndex = bisector(d, mousex);
      // There's no area for the first value.
      // Nothing to do here.
      if (closestIndex === 0) {
        return;
      }
      // Get the two values to used for the highlight.
      var dat = [d[closestIndex - 1], d[closestIndex]];

      _this.showHighlight(dat);

      // Hide other focus circles.
      focusCirlces
        .filter(function(d, i) { return i != closestIndex})
          .attr('r', 6).style('opacity', 0 );

      // Show focus circle.
      var activeCircle = focusCirlces
        .filter(function(d, i) { return i == closestIndex});
      activeCircle.attr('r', 8).style('opacity', 1);

      var activeCircleNode = activeCircle.node();
      var matrix = activeCircleNode.getScreenCTM()
        .translate(activeCircleNode.getAttribute("cx"), activeCircleNode.getAttribute("cy"));

      var posX = window.pageXOffset + matrix.e;
      var posY =  window.pageYOffset + matrix.f - 8;

      chartPopover.setContent(_this.popoverContent(d[closestIndex], closestIndex, {full: _this.data})).show(posX, posY);
      svg.classed({'hgl-on': true});

    });

    pathArea.on("mouseout", function(d) {
      // Hide highlight.
      _this.hideHighlight();
      chartPopover.hide();
      svg.classed({'hgl-on': false});
      focusCirlces
        .transition()
        .attr('r', 6).style('opacity', 0 );
    });

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
        var posY =  window.pageYOffset + matrix.f - 8;

        chartPopover.setContent(_this.popoverContent(d, i, {full: _this.data})).show(posX, posY);
        svg.classed({'hgl-on': true});

        // There's no area for the first value.
        // Nothing to do here.
        if (i === 0) {
          return;
        }
        // Get the two values to used for the highlight.
        var dat = [_this.data[i - 1], _this.data[i]];
        _this.showHighlight(dat);

      })
      .on("mouseout", function() {
        d3.select(this).transition().attr('r', 6).style('opacity', 0 );
        // Hide highlight.
        _this.hideHighlight();
        chartPopover.hide();
        svg.classed({'hgl-on': false});
      });

    // Append Axis.
    svg.select(".x.axis")
      .attr("transform", "translate(" + margin.left + "," + (_height + margin.top + 10) + ")").transition()
      .call(xAxis);

    if (this.xData && this.xData.label) {
      svg.select(".x.axis .label")
        .text(this.xData.label)
        .attr("x", _width / 2)
        .attr("y", 35);
    }

    if (this.yData && this.yData.label) {
      svg.select(".y.axis .label")
        .text(this.yData.label)
        .attr('x', -(_height / 2 + margin.top))
        .attr('y', 10)
        .attr('transform', 'rotate(-90)');
    }

  };

  this.showHighlight = function(dat) {
    // Check if we need to insert stuff.
    if (d3.select('.hgl-back').empty()) {
      // Highlight element.
      dataCanvas.insert("rect", 'path.area')
        .attr("pointer-events", 'none')
        .attr("class", "hgl hgl-back");

      dataCanvas.insert("path", '.focus-circles')
        .attr("pointer-events", 'none')
        .attr("class", "hgl hgl-area");

      dataCanvas.insert("path", '.focus-circles')
        .attr("pointer-events", 'none')
        .attr("class", "hgl hgl-line");
    }

    // Position back highlight.
    dataCanvas.select('.hgl-back')
      .datum(dat)
      .attr("x", function(d) { return x(d[0].date); })
      .attr("y", function(d) { return 0; })
      .attr("width", function(d) { return x(d[1].date) - x(d[0].date); })
      .attr("height", _height);
    // Position area.
    dataCanvas.select('.hgl-area')
      .datum(dat)
      .attr("d", area);
    // Position line.
    dataCanvas.select('.hgl-line')
      .datum(dat)
      .attr("d", line);
  };

  this.hideHighlight = function() {
    dataCanvas.selectAll('.hgl').remove();
  };

  this.destroy = function() {

  };

  //--------------------------------------------------------------------------//
  // 3... 2... 1... GO...
  this._init();
  this.setData(data);
};

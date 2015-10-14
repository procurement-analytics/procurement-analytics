'use strict';
var Reflux = require('reflux');
var React = require('react/addons');
var _ = require('lodash');
var numeral = require('numeral');
var utils = require('../../utils/utils');
var popover = require('../charts/popover');
var $ = require('jquery');

var ScatterplotChart = require('../charts/scatterplot_chart');

var IndFairness = module.exports = React.createClass({

  propTypes: {
    data: React.PropTypes.object
  },

  componentDidMount: function() {
    // Init the popover.
    this.popover = new popover();
  },

  relationChartPopover: function(d) {
    var amount = utils.formatToMillion(d.amount);

    return (
      <dl className="popover-list">
        <dt>{i18n.t("Dimensions.Fairness.PopOvers.Buyer")}</dt>
        <dd>{d.name}</dd>
        <dt>{i18n.t("Dimensions.Fairness.PopOvers.Suppliers")}</dt>
        <dd>{d.suppliers}</dd>
        <dt>{i18n.t("Dimensions.Fairness.PopOvers.Contracts")}</dt>
        <dd>{d.contracts}</dd>
        <dt>{i18n.t("Dimensions.Fairness.PopOvers.Amount")}</dt>
        <dd>{amount}</dd>
      </dl>
    );
  },

  concentrChartPopover: function(d) {
    return (
      <dl className="popover-list">
        <dt>{i18n.t("Dimensions.Fairness.PopOvers.Buyer")}</dt>
        <dd>{d.name}</dd>
        <dt>{i18n.t("Dimensions.Fairness.PopOvers.Contracts")}</dt>
        <dd>{d.contracts}</dd>
        <dt>{i18n.t("Dimensions.Fairness.PopOvers.Amount")}</dt>
        <dd>{d.amount}</dd>
      </dl>
    );
  },

  tableTooltipHover: function(data, colData, event) {
    var $target = $(event.target);
    var pos = $target.offset();
    var x = pos.left + $target.width() / 2;
    var y = pos.top + 8;

    this.popover.setContent(data, 'popover-table').show(x, y);
  },

  tableTooltipOut: function() {
    this.popover.hide();
  },

  render: function() {
    var ldn = this.props.loading;

    var chartData = this.props.data.charts || [];
    var relationChartData = _.find(chartData, {id: 'relationship'});
    //var concentrChartData = _.find(chartData, {id: 'concentration-winning'});
    var top5TableData = _.find(chartData, {id: 'top-contracts'});

    var relationCharts, concentrCharts, top5Table;

    if (relationChartData) {
      relationCharts = relationChartData.data.map(function(o, i) {
        return (
          <div className="chart-item" key={i.toString()}>
            <h2 className="chart-title">{o.label}</h2>
            <ScatterplotChart data={o.data} x={relationChartData.x} y={relationChartData.y} r={relationChartData.r} popoverContentFn={this.relationChartPopover} />
          </div>
        );
      }.bind(this));
    }

/*    if (concentrChartData) {
      concentrCharts = concentrChartData.data.map(function(o, i) {
        return (
          <div className="chart-item" key={i.toString()}>
            <h2 className="chart-title">{o.label}</h2>
            <ScatterplotChart data={o.data} x={concentrChartData.x}  y={concentrChartData.y} popoverContentFn={this.concentrChartPopover} />
          </div>
        );
      }.bind(this));
    }*/

    if (top5TableData) {
      top5Table = top5TableData.data.map(function(d, i) {
        return (
          <div className="chart-item" key={i.toString()}>
            <h2 className="chart-title">{d.label}</h2>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    {top5TableData.header.map(function(c, i) {return <th key={i.toString()}>{c}</th>;})}
                  </tr>
                </thead>
                <tbody>
                  {d.data.map(function(r, i) {
                    return <tr key={i.toString()}>{r.map(function(c, i) {
                      var opts = { key: i.toString() };
                      if (c.tooltip) {
                        opts['onMouseEnter'] = this.tableTooltipHover.bind(this, c.tooltip, c);
                        opts['onMouseLeave'] = this.tableTooltipOut.bind(this, c.tooltip, c);
                      }
                      var value = c.value;
                      if (c.format && c.format == 'amount|million') {
                        value = utils.formatToMillion(value);
                      }
                      return <td {...opts}>{value}</td>;
                    }, this)}</tr>;
                  }, this)}
                </tbody>
              </table>
            </div>
          </div>
        );
      }.bind(this));
    }

    var relationTile = (
      <section className={"tile chart-group" + (ldn ? i18n.t("LoadingTitle") : '') + utils.chartGroupClass(relationCharts)}>
        <h1 className="tile-title">{ldn ? i18n.t("Loading") : relationChartData.title}</h1>
        {relationCharts ? (
          <div className="tile-body">
            <div className="tile-prose">
              <p>{i18n.t("Dimensions.Fairness.Charts.Relation.Description")}</p>
            </div>
            <div className="chart-container">
              {relationCharts}
            </div>
          </div>
        ) : null}
      </section>
    );

/*    var concentrTile = (
      <section className={"tile chart-group" + (ldn ? ' loading' : '') + utils.chartGroupClass(concentrCharts)}>
        <h1 className="tile-title">{ldn ? 'Loading' : concentrChartData.title}</h1>
        {concentrCharts ? (
          <div className="tile-body">
            <div className="tile-prose">
              <p>Vivamus nec sem sed libero placerat fermentum. Sed eget sem vel risus molestie ultricies massa feugiat.</p>
            </div>
            <div className="chart-container">
              {concentrCharts}
            </div>
          </div>
        ) : null}
      </section>
    );*/

    var top5Tile = (
      <section className={"tile chart-group" + (ldn ? i18n.t("LoadingTitle") : '') + utils.chartGroupClass(top5Table)}>
        <h1 className="tile-title">{ldn ? i18n.t("Loading") : top5TableData.title}</h1>
        {top5Table ? (
          <div className="tile-body">
            <div className="tile-prose">
              <p>{i18n.t("Dimensions.Fairness.Charts.Top5.Description")}</p>
            </div>
            <div className="chart-container">
              {top5Table}
            </div>
          </div>
        ) : null}
      </section>
    );

    return (
      <div className="content">

        <div className="col-intro">
          <section className="tile">
            <h1 className="tile-title">{i18n.t("Dimension.Fairness.Title")}</h1>
            <div className="tile-body">
              <p>{i18n.t("Dimension.Fairness.Description")}</p>
            </div>
          </section>
        </div>

        <div className="col-main">
          {top5Tile}
          {relationTile}
          {/*concentrTile*/}
        </div>

      </div>
    );
  }
});

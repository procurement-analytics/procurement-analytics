'use strict';
var React = require('react/addons');
var Reflux = require('reflux');
var _ = require('lodash');
var numeral = require('numeral');
var d3 = require('d3');
var utils = require('../../utils/utils');

var BoxChart = require('../charts/box_chart');
var BarChart = require('../charts/bar_chart');

var IndCostEfficiency = module.exports = React.createClass({

  propTypes: {
    data: React.PropTypes.object,
  },

  distributionChartPopover : function(d, i, otherData) {
    var buckets = otherData.buckets;
    return (
      <dl className="popover-list">
        <dt>{i18n.t("Dimensions.CostEfficiency.PopOvers.Contracts")}</dt>
        <dd>{d[0]}</dd>
        <dt>{i18n.t("Dimensions.CostEfficiency.PopOvers.PriceBucket")}</dt>
        <dd>{buckets[i]} - {buckets[i + 1]}</dd>
      </dl>
    );
  },

  variationChartPopover : function(d) {
    return (
      <dl className="popover-list">
        <dt>{i18n.t("Dimensions.CostEfficiency.PopOvers.Min")}</dt>
        <dd>{numeral(d.whisker1).format('0,0[.]0')}</dd>
        <dt>{i18n.t("Dimensions.CostEfficiency.PopOvers.Quartile1")}</dt>
        <dd>{numeral(d.q1).format('0,0[.]0')}</dd>
        <dt>{i18n.t("Dimensions.CostEfficiency.PopOvers.Median")}</dt>
        <dd>{numeral(d.median).format('0,0[.]0')}</dd>
        <dt>{i18n.t("Dimensions.CostEfficiency.PopOvers.Quartile3")}</dt>
        <dd>{numeral(d.q3).format('0,0[.]0')}</dd>
        <dt>{i18n.t("Dimensions.CostEfficiency.PopOvers.Max")}</dt>
        <dd>{numeral(d.whisker2).format('0,0[.]0')}</dd>
      </dl>
    );
  },

  calcChartYDomain: function(data) {
    var domain = [0]
    domain.push(d3.max(data));
    return domain;
  },

  render: function() {

    var ldn = this.props.loading;

    var chartData = this.props.data.charts || [];
    var distributionChartData = _.find(chartData, {id: 'price-distribution'});
    var variationChartData = _.find(chartData, {id: 'price-variation'});

    var distributionCharts, variationCharts;

    if (distributionChartData) {
      distributionCharts = distributionChartData.data.map(function(o, i) {
        var yDomain = _.cloneDeep(distributionChartData.y);
        yDomain.domain = this.calcChartYDomain(o.data);
        return (
          <div className="chart-item" key={i.toString()}>
            <h2 className="chart-title">{o.label}</h2>
            <BarChart data={o.data} x={distributionChartData.x}  y={yDomain} popoverContentFn={this.distributionChartPopover}/>
          </div>
        );
      }.bind(this));
    }

    if (variationChartData) {
      variationCharts = (
        <div className="chart-item">
          <BoxChart data={variationChartData.data} x={_.omit(variationChartData.x, 'label')} popoverContentFn={this.variationChartPopover}/>
        </div>
      );
    }

    var distributionTile = (
      <section className={"tile chart-group" + (ldn ? i18n.t("LoadingTitle") : '') + utils.chartGroupClass(distributionCharts)}>
        <h1 className="tile-title">{i18n.t("Dimensions.CostEfficiency.Charts.Distribution.Title")}</h1>
        {distributionCharts ? (
          <div className="tile-body">
            <div className="tile-prose">
              <p>{i18n.t("Dimensions.CostEfficiency.Charts.Distribution.Description")}</p>
            </div>
            <div className="chart-container">
              {distributionCharts}
            </div>
          </div>
        ) : null}
      </section>
    );

    var variationTile = (
      <section className={"tile chart-group chart-group-none" + (ldn ? i18n.t("LoadingTitle") : '')}>
        <h1 className="tile-title">{i18n.t("Dimensions.CostEfficiency.Charts.Variation.Title")}</h1>
        {variationCharts ? (
          <div className="tile-body">
            <div className="tile-prose">
              <p>{i18n.t("Dimensions.CostEfficiency.Charts.Variation.Description")}</p>
            </div>
            <div className="chart-container">
              {variationCharts}
            </div>
          </div>
        ) : null}
      </section>
    );

    return (
      <div className="content">

        <div className="col-intro">
          <section className="tile">
            <h1 className="tile-title">{i18n.t("Dimensions.CostEfficiency.Title")}</h1>
            <div className="tile-body">
              <p>{i18n.t("Dimensions.CostEfficiency.Description")}</p>
            </div>
          </section>
        </div>

        <div className="col-main">
          {distributionTile}
          {variationTile}
        </div>
        
      </div>
    );
  }
});

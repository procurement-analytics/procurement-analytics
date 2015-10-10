'use strict';
var _ = require('lodash');
var i18n = require("../components/i18n");
var fields = [
  {
    id: 'comparison',
    active: 'all',

    opts: [
      {
        key: 'all',
        value: i18n.t("NLForm.Comparison.FullDataSet"),
        tokens: {
          'comparisonArticle': i18n.t("NLForm.Comparison.ForThe")
        }
      },
      {
        key: 'size_supplier',
        value: i18n.t("NLForm.Comparison.SizeSupplier"),
        tokens: {
          'comparisonArticle': i18n.t("NLForm.Comparison.For")
        }
      },
      {
        key: 'contract_procedure',
        value: i18n.t("NLForm.Comparison.ContractProcedure"),
        tokens: {
          'comparisonArticle': i18n.t("NLForm.Comparison.For")
        }
      },
      {
        key: 'contract_type',
        value: i18n.t("NLForm.Comparison.ContractType"),
        tokens: {
          'comparisonArticle': i18n.t("NLForm.Comparison.For")
        }
      }
    ]
  },

  {
    id: 'dimension',
    active: 'summary',

    opts: [
      {
        key: 'summary',
        value: i18n.t('NLForm.Dimension.Summary'),
        tokens: {
          'dimensionArticle': i18n.t("NLForm.Dimension.SummaryArticle")
        }
      },
      {
        key: 'timeliness',
        value: i18n.t("NLForm.Dimension.Timeliness"),
        tokens: {
          'dimensionArticle': i18n.t("NLForm.Dimension.TimelinessArticle")
        }
      },
      {
        key: 'cost-efficiency',
        value: i18n.t("NLForm.Dimension.CostEfficiency"),
        tokens: {
          'dimensionArticle': i18n.t("NLForm.Dimension.CostEfficiencyArticle")
        }
      },
      {
        key: 'fairness',
        value: i18n.t("NLForm.Dimension.Fairness"),
        tokens: {
          'dimensionArticle': i18n.t("NLForm.Dimension.FairnessArticle")
        }
      }
    ]
  }
];

module.exports.getSentence = function() { 
  return i18n.t("NLForm.Sentence");
};

module.exports.fields = function() {
  return fields;
};

module.exports.fields.value = function() {
  return fields;
};

module.exports.fields.setActive = function(fieldname, activeOpt) {
   _.find(fields, {id: fieldname}).active = activeOpt;
   return this;
};
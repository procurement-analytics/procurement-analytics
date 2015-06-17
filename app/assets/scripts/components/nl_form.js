'use strict';
var React = require('react/addons');
var Router = require('react-router');
var _ = require('lodash');

var NlForm = module.exports = React.createClass({

  // Regular expressions
  fieldsRgx: new RegExp('{%([a-zA-Z0-9-_]+)%}', 'g'),
  fieldValidateRgx: new RegExp('{%([a-zA-Z0-9-_]+)%}'),
  splitterRgx: new RegExp('({(?:%|#)[a-zA-Z0-9-_]+(?:%|#)})'),


  getInitialState: function() {
    return {
      openFields: []
    }
  },

  positionFieldOptions: function() {
    var fieldOptions = Array.prototype.slice.call(this.getDOMNode().querySelectorAll('[data-hook*="nl-position"]'));

    fieldOptions.forEach(function(fOpt) {
      var refLink = this.getDOMNode().querySelector('a[href="#' + fOpt.id + '"]');
      //console.log('refLink', refLink);

      fOpt.style.position = 'absolute';
      fOpt.style.top = refLink.offsetTop + 'px';
      fOpt.style.left = refLink.offsetLeft + 'px';

    }.bind(this));
  },

  onOutsideClick: function(e) {
    var noClickAreas = Array.prototype.slice.call(this.getDOMNode().querySelectorAll('[data-hook*="stop-doc-click"]'));
    var prevent = false;

    _.forEach(noClickAreas, function(ncl) {
      if (this.isParentOrSelf(ncl, e.target)) {
        prevent = true;
        return false;
      }
    }, this);

    if (prevent) {
      return;
    }

    if (this.state.openFields.length) {
      this.setState({openFields: []});
    }
  },

  nlFieldClick: function(field, e) {
    e.preventDefault();
    console.log(field);
    this.setState({openFields: [field]});
  },

  nlFieldOptSelect: function(field, opt) {
    var selection = {};
    _.forEach(this.props.fields, function(f) {
      selection[f.id] = f.active;
    });
    // Update with new selected option.
    selection[field] = opt;
    // Send back to parent.
    this.props.onNlSelect(selection);
    this.setState({openFields: []});
  },

  renderNlSentence: function() {
    var sentence = this.props.sentence;
    var sentenceParts = sentence.split(this.splitterRgx);
    //console.log('sentenceParts', sentenceParts);

    // Extract fields tokens {%fieldname%} to loop ever.
    var fieldsTkn = sentence.match(this.fieldsRgx);

    _.forEach(fieldsTkn, function(fTkn) {
      var fieldName = fTkn.match(this.fieldValidateRgx)[1];
      var fieldData = _.find(this.props.fields, {id: fieldName});

      var activeOpt = _.find(fieldData.opts, {key: fieldData.active});

      // Get the field index to replace it.
      var fieldIdx = sentenceParts.indexOf(fTkn);
      if (fieldIdx !== -1) {
        sentenceParts[fieldIdx] = <a href={"#" + fieldName} key={fieldName} onClick={this.nlFieldClick.bind(this, fieldName)} data-hook="stop-doc-click">{activeOpt.value}</a>;
      }

      _.forEach(activeOpt.tokens, function(v, k) {
        // Replace the tokens {#fieldname#} in the sentence.
        // These tokens are mostly to aid the natural language.
        // An example being prepositions.
        var searchTkn = '{#' + k + '#}';
        var tokenIdx = sentenceParts.indexOf(searchTkn);
        if (tokenIdx !== -1) {
          sentenceParts[tokenIdx] = v;
        }
      });
    }, this);

    // Remove non replaced tokens from the string.
    // Tokens can be left behind when a token does not exist for a given field.
    return _.filter(sentenceParts, function(v) {
      if (_.isString(v)) {
        return v.match(this.splitterRgx) ? false : true;
      }
      return true;
    }.bind(this));
  },

  renderNlFieldOptions: function() {
    var fields = this.state.openFields.map(function(fieldName) {
      return _.find(this.props.fields, {id: fieldName});
    }.bind(this));

    // Build a ul for each field.
    return fields.map(function(field) {
      return <NlFieldOptions key={field.id} data={field} onOptionSelect={this.nlFieldOptSelect}/>
    }.bind(this));
  },

  componentDidMount: function() {
    console.log('NlForm -- componentDidMount');
    this.positionFieldOptions();

    document.addEventListener('click', this.onOutsideClick, true);
  },

  componentDidUpdate: function(/*prevProps, prevState*/) {
    console.log('NlForm -- componentDidUpdate');
    this.positionFieldOptions();
  },

  render: function() {
    var nlSentence = this.renderNlSentence();
    var nlFieldOptions = this.renderNlFieldOptions();

    return (
      <span>
        {nlSentence}
        {nlFieldOptions}
      </span>
    );
  },

  isParentOrSelf: function(parent, child) {
    return child == parent ? true : this.isParent(parent, child);
  },

  isParent: function(parent, child) {
    var node = child.parentNode;
    while (node != null) {
      if (node == parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }
});


var NlFieldOptions = React.createClass({
  onOptionClick: function(field, option, e) {
    e.preventDefault();
    this.props.onOptionSelect(field, option);
  },

  render: function() {
    var field = this.props.data;

    var items = field.opts.map(function(opt) {
      return (
        <li key={opt.key} className={field.active == opt.key ? 'active' : ''}><a href="#" onClick={this.onOptionClick.bind(this, field.id, opt.key)}>{opt.value}</a></li>
      )
    }.bind(this));

    return <ul className="nl-select" id={field.id} data-hook="nl-position stop-doc-click">{items}</ul>;
  }
});
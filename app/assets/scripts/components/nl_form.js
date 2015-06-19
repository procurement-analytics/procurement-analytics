'use strict';
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var Router = require('react-router');
var _ = require('lodash');

var NlForm = module.exports = React.createClass({

  // How the NlForm works:
  // The component expects a sentence to be passed to it. Something like:
  // 
  // {%name%} did it! {#pronoun#} put it {#article#} the {%place%}.
  // 
  // {%name%} and {%place%} are fields. These are going to be converted to links
  // to provide the interactivity. On click the option box will pop up and an
  // option can be selected.
  // 
  // {#pronoun#} and {#article#} are replacement tokens, meaning that they may
  // change based on one of the fields.
  // For example, if field {%name%} is Daniel, {#pronoun#} will have to be "He".
  // but if {%name%} is Kate, {#pronoun#} will have to be "She".
  // 
  // To define the behavior of these fields you pass a configuration array to
  // the component. Each element of the array is a field definition.
  // The config array for the previous example would be:
  // [
  //   {
  //    id: 'name',               // Field name as defined in the token.
  //    active: 'daniel',         // Key of the active option.
  //
  //    opts: [                   // Available options.
  //      {
  //        key: 'daniel',        // Option key will be returned when selected.
  //        value: 'Daniel',      // Presentation value.
  //        tokens: {             // Replacement tokens. Keyed by the token name.
  //          'pronoun': 'He'
  //        }
  //      },
  //      {
  //        key: 'kate',
  //        value: 'Kate',
  //        tokens: {
  //          'pronoun': 'She'
  //        }
  //      },
  //    ]
  //   },
  //   {
  //    id: 'place',             // Field name as defined in the token.
  //    active: 'table',         // Key of the active option.
  //
  //    opts: [                  // Available options.
  //      {
  //        key: 'table',        // Option key will be returned when selected.
  //        value: 'table',      // Presentation value.
  //        tokens: {            // Replacement tokens. Keyed by the token name.
  //          'article': 'on'
  //        }
  //      },
  //      {
  //        key: 'drawer',
  //        value: 'drawer',
  //        tokens: {
  //          'article': 'in'
  //        }
  //      },
  //    ]
  //   }
  // ]
  // 
  // When an option is selected the parent is notified through
  // the this.props.onNlSelect() function passing an object containing the
  // values for all the fields.
  // For the example, said object would be:
  // {
  //  name: 'daniel',
  //  place: 'table'
  // }
  // 

  // Regular expressions.
  fieldsRgx: new RegExp('{%([a-zA-Z0-9-_]+)%}', 'g'),
  fieldValidateRgx: new RegExp('{%([a-zA-Z0-9-_]+)%}'),
  splitterRgx: new RegExp('({(?:%|#)[a-zA-Z0-9-_]+(?:%|#)})'),


  propTypes: {
    sentence: React.PropTypes.string.isRequired,
    fields: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    onNlSelect: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      openFields: []
    }
  },

  /**
   * Positions the field options based on the trigger word.
   * Each element with the data-hook*="nl-position", will be positioned
   * according the link (trigger word) which href is the element's id:
   *
   * <ul id="field1" data-hook="nl-position">
   * <a href="#field1"></a>
   */
  positionFieldOptions: function() {
    var fieldOptions = Array.prototype.slice.call(document.querySelectorAll('[data-hook*="nl-position"]'));

    fieldOptions.forEach(function(fOpt) {
      var refLink = this.getDOMNode().querySelector('a[href="#' + fOpt.id + '"]');
      //console.log('refLink', refLink);

      fOpt.style.position = 'absolute';
      fOpt.style.top = refLink.offsetTop + 'px';
      fOpt.style.left = refLink.offsetLeft + 'px';

    }.bind(this));
  },

  /**
   * Listener: Document click
   * If the click does not originate from one of the fields or the field
   * options, the field options are closed.
   * The data-hook to define no click areas is "stop-doc-click"
   */
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

  /**
   * Listener: Field click (word)
   * Sets the clicked fields as open, closing the other in the process.
   */
  nlFieldClick: function(field, e) {
    e.preventDefault();
    console.log(field);
    this.setState({openFields: [field]});
  },

  /**
   * Listener: Field option click.
   * Builds the selection object:
   * { field_name: selected_option, ... }
   * and passes it to the parent through the this.props.onNlSelect()
   * Closes all the fields.
   */
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

  /**
   * Renders the sentence replacing the fields with the correct value.
   * 
   * @return Array
   *   Array of React components and strings. 
   */
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

      if (!activeOpt) {
        console.error(new Error('NlForm -- Active option "' + fieldData.active + '" was not found for field "' + fieldName + '"'));
        return;
      }

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

  /**
   * Renders the field options using <NlFieldOptions>
   * 
   * @return Array NlFieldOptions
   */
  renderNlFieldOptions: function() {
    var fields = this.state.openFields.map(function(fieldName) {
      return _.find(this.props.fields, {id: fieldName});
    }.bind(this));

    // Build a ul for each field.
    return fields.map(function(field) {
      return <NlFieldOptions key={field.id} data={field} onOptionSelect={this.nlFieldOptSelect} />;
    }.bind(this));
  },

  /**
   * Lifecycle: Component was mounted.
   */
  componentDidMount: function() {
    console.log('NlForm -- componentDidMount');
    this.positionFieldOptions();
    document.addEventListener('click', this.onOutsideClick, true);
  },

  /**
   * Lifecycle: Component was unmounted.
   */
  componentWillUnmount: function() {
    console.log('NlForm -- componentWillUnmount');
    document.removeEventListener('click', this.onOutsideClick, true);
  },

  /**
   * Lifecycle: Component was updated.
   */
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
        {/* Although rendered here the actual element is appended to the body. */}
        {nlFieldOptions}
      </span>
    );
  },

  /**
   * Check whether the given "parent" is the "child" or one of
   * it's ancestors.
   * 
   * @return boolean
   */
  isParentOrSelf: function(parent, child) {
    return child == parent ? true : this.isParent(parent, child);
  },

  /**
   * Check whether the given "parent" is one of "child"'s ancestors.
   * 
   * @return boolean
   */
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

/**
 * React component to render the field option boxes.
 * The element will be appended to the body and removed when no longer in use.
 * Inspiration from http://stackoverflow.com/questions/28802179/how-to-create-a-react-modalwhich-is-append-to-body-with-transitions 
 */
var NlFieldOptions = React.createClass({
  element: null,

  render: function() {
    return null;
  },

  onOptionClick: function(field, option, e) {
    e.preventDefault();
    this.props.onOptionSelect(field, option);
  },

  componentDidMount: function() {
    var p = document.createElement('div');
    p.id = this.props.data.id + '-wrapper';
    document.body.appendChild(p);

    this.element = p;
    this.componentDidUpdate();

    if (document.body.className.indexOf('curtain-on') === -1) {
      document.body.className += ' curtain-on';
    }
  },

  componentWillUnmount: function() {
    document.body.className = document.body.className.replace('curtain-on', '');

    // When the component unmounts we have to manually remove it from the
    // DOM since we manually moved it.
    // By doing so we can't use ReactCSSTransitionGroup to exit the element.
    // We can however simulate the behavior. So:
    // 
    // - Add the class "nl-curtain-leave".
    // - On the next tick add "nl-curtain-leave-active"
    // - Listen for the transition to end ensuring that we're listening to
    // the correct event.
    // - Remove the element when done.
    // 
    var elementAnim = this.element.querySelector('.nl-curtain');
    elementAnim.className += ' nl-curtain-leave';
    // Next tick.
    setTimeout(function() {
      elementAnim.className += ' nl-curtain-leave-active';
    }, 1);

    // Caveat: (this also happens with ReactCSSTransitionGroup)
    // The "transitionend" event will fire for every transition therefore
    // if we have two transitions, one lasting 5s and another 1s,
    // the element will be removed as soon as the first transition finishes.
    var transitionEnd = transitionEndEventName();
    elementAnim.addEventListener(transitionEnd, function() {
      if (this.element) {
        document.body.removeChild(this.element);
        this.element = null;
      }
    }.bind(this), false);
  },

  componentDidUpdate: function() {
    var field = this.props.data;

    var items = field.opts.map(function(opt) {
      return (
        <li key={opt.key} className={field.active == opt.key ? 'active' : ''}><a href="#" onClick={this.onOptionClick.bind(this, field.id, opt.key)}>{opt.value}</a></li>
      )
    }.bind(this));

    var data = (
      <ReactCSSTransitionGroup component="div" transitionName="nl-curtain" transitionAppear={true}>
        <div className="nl-curtain">
          <ul className="nl-select" id={field.id} data-hook="nl-position stop-doc-click">{items}</ul>
        </div>
      </ReactCSSTransitionGroup>
    );

    React.render(data, this.element);
  },
});


/**
 * Checks what's the browser specific transitionend event to use.
 */
var transitionEndEventName = function() {
  var i,
    undefined,
    el = document.createElement('div'),
    transitions = {
      'transition':'transitionend',
      'msTransition': 'MSTransitionEnd',
      'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    };

  for (i in transitions) {
    if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
      return transitions[i];
    }
  }
  throw new Error('transitionend event not supported by the browser.');
}
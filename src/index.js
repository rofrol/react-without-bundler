// inspired by http://jamesknelson.com/learn-raw-react-ridiculously-simple-forms/

var cities = [
  'Warsaw',
  'Washington',
  'Piaseczno',
  'Chicago'
];

// Object.assign polyfill
// https://developer.mozilla.org/pl/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      // We must check against these specific cases.
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}

['div', 'span', 'ul', 'li', 'a', 'h1', 'h2', 'input', 'form', 'textarea', 'button'].map(function(elem) { this[elem] = React.DOM[elem]; });

/*
 * Components
 */

var CitiesForm = React.createFactory(React.createClass({
  propTypes: {
    value: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
  },

  onSearchChange: function(e) {
    this.props.onChange(Object.assign({}, this.props.value, {name: e.target.value}));
  },

  render: function() {
    return (
      div({id: 'dropdiv'},
        input({
          type: 'text',
          placeholder: 'City',
          value: this.props.value.name,
          onChange: this.onSearchChange,
        }),
        ul({id: 'drop'},
          // Use arrow function or bind, otherwise `this` will reference to window
          // https://www.sitepoint.com/bind-javascripts-this-keyword-react/
          cities.reduce(function(acc, element) {
            var input = this.props.value.name.toLowerCase();
            if(this.props.value.name.trim() !== '' && element.toLowerCase().substring(0, input.length) === input) {
              acc.push(li(null, element));
            }
            return acc;
          }.bind(this), [])
        )
      )
    );
  },
}));


/*
 * Constants
 */

var SEARCH_TEMPLATE = {name: ""};


/*
 * Actions
 */

function updateSearch(contact) {
  setState({ newSearch: contact });
}

/*
 * Model
 */


// The app's complete current state
var state = {};

// Make the given changes to the state and perform any required housekeeping
function setState(changes) {
  Object.assign(state, changes);

  ReactDOM.render(
    CitiesForm(Object.assign({}, state, {
      value: state.newSearch,
      onChange: updateSearch,
    })),
    document.getElementById('app')
  );
}

// Set initial data
setState({
  newSearch: Object.assign({}, SEARCH_TEMPLATE),
});


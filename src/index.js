// from http://jamesknelson.com/learn-raw-react-ridiculously-simple-forms/

(function() {
  var global = this;
  ['div', 'span', 'ul', 'li', 'a', 'h1', 'h2', 'input', 'form', 'textarea', 'button'].map(elem => { global[elem] = React.DOM[elem]; });
}).call(this);

var cities = [
  'Warsaw',
  'Washington',
  'Piaseczno',
  'Chicago'
];

/*
 * Components
 */

var ContactForm = React.createFactory(React.createClass({
  propTypes: {
    value: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
  },

  onNameChange: function(e) {
    this.props.onChange(Object.assign({}, this.props.value, {name: e.target.value}));
  },

  render: function() {
    var errors = this.props.value.errors || {};

    return (
      div({id: 'dropdiv'},
        input({
          type: 'text',
          placeholder: 'City',
          value: this.props.value.name,
          onChange: this.onNameChange,
        }),
        ul({id: 'drop'},
          // Use arrow function because with normal function, this will reference to global window
          // https://www.sitepoint.com/bind-javascripts-this-keyword-react/
          cities.reduce((acc, element) => {
            if(this.props.value.name.trim() !== '' && element.toLowerCase().startsWith(this.props.value.name.toLowerCase())) {
              acc.push(li(null, element));
            }
            return acc;
          }, [])
        )
      )
    );
  },
}));


/*
 * Constants
 */


var CONTACT_TEMPLATE = {name: ""};



/*
 * Actions
 */


function updateNewContact(contact) {
  setState({ newContact: contact });
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
    ContactForm(Object.assign({}, state, {
      value: state.newContact,
      onChange: updateNewContact,
    })),
    document.getElementById('app')
  );
}

// Set initial data
setState({
  newContact: Object.assign({}, CONTACT_TEMPLATE),
});

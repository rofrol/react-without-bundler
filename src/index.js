// from http://jamesknelson.com/learn-raw-react-ridiculously-simple-forms/

/*
 * Components
 */

['div', 'span', 'ul', 'li', 'a', 'h1', 'h2', 'input', 'form', 'textarea', 'button'].map(elem => { window[elem] = React.DOM[elem]; });

var cities = [
  'Warsaw',
  'Washington',
  'Piaseczno',
  'Chicago'
];

var ContactForm = React.createFactory(React.createClass({
  propTypes: {
    value: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
  },

  onNameChange: function(e) {
    this.props.onChange(Object.assign({}, this.props.value, {name: e.target.value}));
  },

  onEmailChange: function(e) {
    this.props.onChange(Object.assign({}, this.props.value, {email: e.target.value}));
  },

  onDescriptionChange: function(e) {
    this.props.onChange(Object.assign({}, this.props.value, {description: e.target.value}));
  },

  onSubmit: function(e) {
    e.preventDefault();
    this.props.onSubmit();
  },

  render: function() {
    var errors = this.props.value.errors || {};

    return (
      form({onSubmit: this.onSubmit, className: 'ContactForm', noValidate: true},
        div({id: 'dropdiv'},
          input({
            type: 'text',
            className: errors.name && 'ContactForm-error',
            placeholder: 'Name (required)',
            value: this.props.value.name,
            onChange: this.onNameChange,
          }),
          ul({id: 'drop'},
            // Use arrow function because with normal function, this will reference to global window
            // https://www.sitepoint.com/bind-javascripts-this-keyword-react/
            cities.reduce((acc, element) => {
              if(this.props.value.name.trim() !== '' && element.startsWith(this.props.value.name)) {
                acc.push(li(null, element));
              }
              return acc;
            }, [])
          )
        ),
        input({
          type: 'email',
          className: errors.email && 'ContactForm-error',
          placeholder: 'Email (required)',
          value: this.props.value.email,
          onChange: this.onEmailChange,
        }),
        textarea({
          placeholder: 'Description',
          value: this.props.value.description,
          onChange: this.onDescriptionChange,
        }),
        button({type: 'submit'}, "Add Contact")
      )
    );
  },
}));


var ContactItem = React.createFactory(React.createClass({
  propTypes: {
    name: React.PropTypes.string.isRequired,
    email: React.PropTypes.string.isRequired,
    description: React.PropTypes.string,
  },

  render: function() {
    return (
      li({className: 'ContactItem'},
        h2({className: 'ContactItem-name'}, this.props.name),
        a({className: 'ContactItem-email', href: 'mailto:'+this.props.email}, this.props.email),
        div({className: 'ContactItem-description'}, this.props.description)
      )
    );
  },
}));


var ContactView = React.createFactory(React.createClass({
  propTypes: {
    contacts: React.PropTypes.array.isRequired,
    newContact: React.PropTypes.object.isRequired,
    onNewContactChange: React.PropTypes.func.isRequired,
    onNewContactSubmit: React.PropTypes.func.isRequired,
  },

  render: function() {
    var contactItemElements = this.props.contacts
      .filter(function(contact) { return contact.email; })
      .map(function(contact) { return ContactItem(contact); });

    return (
      div({className: 'ContactView'},
        h1({className: 'ContactView-title'}, "Contacts"),
        ul({className: 'ContactView-list'}, contactItemElements),
        ContactForm({
          value: this.props.newContact,
          onChange: this.props.onNewContactChange,
          onSubmit: this.props.onNewContactSubmit,
        })
      )
    );
  },
}));


/*
 * Constants
 */


var CONTACT_TEMPLATE = {name: "", email: "", description: "", errors: null};



/*
 * Actions
 */


function updateNewContact(contact) {
  setState({ newContact: contact });
}


function submitNewContact() {
  var contact = Object.assign({}, state.newContact, {key: state.contacts.length + 1, errors: {}});

  if (!contact.name) {
    contact.errors.name = ["Please enter your new contact's name"];
  }
  if (!/.+@.+\..+/.test(contact.email)) {
    contact.errors.email = ["Please enter your new contact's email"];
  }

  setState(
    Object.keys(contact.errors).length === 0
    ? {
        newContact: Object.assign({}, CONTACT_TEMPLATE),
        contacts: state.contacts.slice(0).concat(contact),
      }
    : { newContact: contact }
  );
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
    ContactView(Object.assign({}, state, {
      onNewContactChange: updateNewContact,
      onNewContactSubmit: submitNewContact,
    })),
    document.getElementById('app')
  );
}

// Set initial data
setState({
  contacts: [
    {key: 1, name: "James K Nelson", email: "james@jamesknelson.com", description: "Front-end Unicorn"},
    {key: 2, name: "Jim", email: "jim@example.com"},
  ],
  newContact: Object.assign({}, CONTACT_TEMPLATE),
});


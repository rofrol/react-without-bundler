// inspired by http://jamesknelson.com/learn-raw-react-ridiculously-simple-forms/

var cities = [
  'Warsaw',
  'Washington',
  'Piaseczno',
  'Chicago'
];

['div', 'ul', 'li', 'input', 'form'].map(function(elem) { this[elem] = React.DOM[elem]; });

/*
 * Components
 */


function CitiesForm (props) {
  return (
    div({id: 'dropdiv'},
      input({
        type: 'text',
        placeholder: 'City',
        value: props.value.name,
        onChange: props.onChange,
      }),
      ul({id: 'drop'},
        cities.reduce(function(acc, element) {
          var input = props.value.name.toLowerCase();
          if(props.value.name.trim() !== '' && element.toLowerCase().substring(0, input.length) === input) {
            acc.push(li(null, element));
          }
          return acc;
        }, [])
      )
    )
  );
}

CitiesForm.propTypes = {
  value: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.func.isRequired,
};

/*
 * Constants
 */

var SEARCH_TEMPLATE = {name: ""};


/*
 * Actions
 */

function updateSearch(e) {
  setState({ newSearch: {name: e.target.value} });
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
  newSearch: SEARCH_TEMPLATE,
});


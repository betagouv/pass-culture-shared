# pass-culture-shared
Tous les objets javascript partagés entre l'application découverte et l'application pro


## Documentation

### requestData

#### Hello example with handleSuccess and handleFail

requestData is an action creator helping for requesting data from the backend.
It will feed the state redux.
Imagine a simple component used for fetching infos on our pass culture venues:

```javascript
import get from 'lodash.get'
import { requestData } from 'pass-culture-shared'
import { connect } from 'redux'

class VenuesPage extends Component {

  constructor () {
    super()
    this.state = {
      globalError: null,
      venues: []
      venuesError: null
    }
  }

  componentDidMount() {
      // you need to pass
      // method: 'GET', 'POST', 'PATCH', 'PUT' or 'DELETE'
      // path: the route api path to request data (with or without the first trailing slash)
      // config (optional): some config parameters explained later
      this.props.dispatch(requestData('GET', 'venues', {
        // handleSuccess is the "promised" callback function you can use
        // to do things on the success of the request
        // state: the global redux state (if you need it)
        // action: the action associated to SUCCESS_DATA_VENUES giving the data
        handleSuccess: (state, action) => this.setState({ venues: action.data })
        // ... or you can do things on fail
        // you can notably grab backend errors info
        // in action.errors.<key>[array of error string lines]
        handleFail: (state, action) => this.setState({
          // when action returns an error stored in the
          // 'global' key, it means a 500 error
          // except if the backend specially set this
          // error key for saying something else
          globalError: get(action, 'errors.global.0'),
          // when action returns an error with the same key as the pass
          // it means most of the time that the api handled a 400 like error
          venuesError: get(action, 'errors.venues.0')
        })
      }))
  }

  render () {
    if (this.state.venuesError) {
      return (
        <div className="is-warning">
          {/* something like 'You are not authorized to fetch venues' */}
          {this.state.venuesError}
        </div>
      )
    }

    if (this.state.globalError) {
      return (
        <div className="is-danger">
        {/* something like 'Connection to the server has failed' */}
          {this.state.globalError}
        </div>
      )
    }

    return (
      <div>
        {this.state.venues.map(venue => <p key={venue.id}> {venue.name} </p>)}
      </div>
    )
  }
}

// NOTE: it is important to connect to pass
// the dispatch function to the props
export default connect()(VenuesPage)
```

#### Use the redux state




















#### Arguments :

| nom | type | exemple | description |
| -- | -- | -- | -- |
| method | string | "GET" | Méthode HTTP de l'appel Rest |
| path | string | "/users/current" | URL relatif sur l'API |
| config | objet | {key: "value"} | Configuration de comportement voir ci-après |


#### Options disponibles dans l'objet config :


 **ATTENTION, DOC EN COURS DE REDACTION**


| nom | type | exemple | requis | défault | description |
| -- | -- | -- | -- | -- | -- |
| key | string | "bookings" | oui | - | Clé sous la quelle seront stockés les objets dans le store, sous `state.data` |
| normalizer | objet | - | non | `null` | |
| handleSuccess | function | - | oui | `(state, action) => {}` | Callback en cas de succès de l'appel Rest |
| handleFail | function | - |  oui | `(state, action) => {}` | Callback en cas de succès de l'appel Rest |
| isMergingDatum | bool | - | non | `false` | |
| isMutatingDatum | bool | - | non | `false` | |
| isMergingArray | bool | - | non | `false` | |
| isMutatingArray | bool | - | non | `false` | |
| nextState | objet | - | non | `{}` | |
| getSuccessState | function | - | non | `undefined` | |

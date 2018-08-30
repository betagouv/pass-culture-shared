# pass-culture-shared
Tous les objets javascript partagés entre l'application découverte et l'application pro


## Documentation

### requestData

```javascript
import { requestData } from 'pass-culture-shared';
import { connect } from 'redux';

//...

this.props.actions.requestData(method, path, config);

//...

const mapDispatchToProps = () => ({
  actions: {
    requestData
  }
});

```

Créer une action (à wrapper dans dispatch) qui va engendrer le chargement des données depuis l'API Rest et l'alimentation du state redux.



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

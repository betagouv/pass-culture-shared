import { getNextState } from '../utils/data'

const ASSIGN_DATA = 'ASSIGN_DATA'
const RESET_DATA = 'RESET_DATA'

const initialState = {
  bookings: [],
  events: [],
  eventOccurences: [],
  mediations: [],
  occasions: [],
  offers: [],
  offerers: [],
  providers: [],
  things: [],
  types: [],
  venues: [],
  venueProviders: []
}

export const data = (state = initialState, action) => {
  if (action.type === ASSIGN_DATA) {
    return Object.assign({}, state, action.patch)

  } else if (action.type === RESET_DATA) {
    return initialState

  } else if (/SUCCESS_DATA_(DELETE|GET|POST|PUT|PATCH)_(.*)/.test(action.type)) {
    // unpack config
    const key = action.config.key ||
      action.path.replace(/\/$/, '').replace(/\?.*$/, '')

    // resolve
    const nextState = getNextState(
      state,
      action.method,
      {
        // force casting into an array
        [key]: !Array.isArray(action.data)
                  ? [action.data]
                  : action.data,
      },
      action.config
    )

    // last
    if (action.config.getSuccessState) {
      Object.assign(nextState, action.config.getSuccessState(state, action))
    }

    // return
    return Object.assign({}, state, nextState)

  }
  return state
}

export const assignData = patch => ({
  patch,
  type: ASSIGN_DATA,
})

export const failData = (method, path, errors, config) => ({
  config,
  errors,
  method,
  path,
  type: `FAIL_DATA_${method.toUpperCase()}_${path.toUpperCase()}${
    config.local ? ' (LOCAL)' : ''
  }`,
})

export const requestData = (method, path, config = {}) => ({
  config,
  method,
  path,
  type: `REQUEST_DATA_${method.toUpperCase()}_${path.toUpperCase()}${
    config.local ? ' (LOCAL)' : ''
  }`,
})

export const resetData = () => ({
  type: RESET_DATA,
})

export const successData = (method, path, data, config = {}) => ({
  config,
  data,
  method,
  path,
  type: `SUCCESS_DATA_${method.toUpperCase()}_${path.toUpperCase()}${
    config.local ? ' (LOCAL)' : ''
  }`,
})

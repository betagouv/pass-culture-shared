const MERGE_ERRORS = 'MERGE_ERRORS'
const REMOVE_ERRORS = 'REMOVE_ERRORS'
const RESET_ERRORS = 'RESET_ERRRORS'

const initialState = {}

export const errors = (state = initialState, action) => {
  switch (action.type) {
    case MERGE_ERRORS:
      return Object.assign({}, state, {
        [action.name]: Object.assign({}, state[action.name], action.patch),
      })
    case REMOVE_ERRORS:
      return Object.assign({}, state, {
        [action.name]: null,
      })
    case RESET_ERRORS:
      return initialState
    default:
      return state
  }
}

export const mergeErrors = (name, patch) => ({
  name,
  patch,
  type: MERGE_ERRORS,
})

export const removeErrors = name => ({
  name,
  type: REMOVE_ERRORS,
})

export const resetErrors = () => ({
  type: RESET_ERRORS,
})

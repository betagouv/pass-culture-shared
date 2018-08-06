import moment from 'moment'

const initialState = {}

export const tracker = (state = initialState, action) => {
  if (
    /SUCCESS_DATA_(DELETE|GET|POST|PUT|PATCH)_(.*)/.test(action.type) &&
    action.method.toUpperCase() === 'GET'
  ) {
    return Object.assign({}, state, {
      [action.path]: moment()
    })
  }
  return state
}

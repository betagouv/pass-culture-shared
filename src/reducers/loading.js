export const SHOW_LOADING = 'SHOW_LOADING'
export const CLOSE_LOADING = 'CLOSE_LOADING'

const intialState = {
  config: {},
  isActive: false,
}

export function loading(state = intialState, action) {
  switch (action.type) {
    case SHOW_LOADING:
      return Object.assign({}, state, {
        config: action.config,
        isActive: true,
      })
    case CLOSE_LOADING:
      return Object.assign({}, state, {
        config: action.config,
        isActive: false,
      })
    default:
      return state
  }
}

export function showLoading(config) {
  return {
    config,
    type: SHOW_LOADING,
  }
}

export function closeLoading(config) {
  return {
    config,
    type: CLOSE_LOADING,
  }
}

export default loading

export const ASSIGN_MODAL_CONFIG = 'ASSIGN_MODAL_CONFIG'
export const CLOSE_MODAL = 'CLOSE_MODAL'
export const SHOW_MODAL = 'SHOW_MODAL'

const initialState = {}

export function modal(state = initialState, action) {
  switch (action.type) {
    case CLOSE_MODAL:
      return Object.assign({}, state,
        { [action.name]: { isActive: false } },
      )
    case ASSIGN_MODAL_CONFIG:
      return Object.assign({}, state,
        {
          [action.name]: Object.assign({}, state[action.name].config, action.config)
        }
      )
    case SHOW_MODAL:
      return Object.assign({}, state,
        {
          [action.name]: Object.assign({}, state[action.name],
            { $modal: action.$modal, config: action.config, isActive: true })
        }
      )
    default:
      return state
  }
}

export function assignModalConfig(config) {
  return { config, type: ASSIGN_MODAL_CONFIG }
}

export function closeModal(name) {
  return { name, type: CLOSE_MODAL }
}

export function showModal(name, $modal, config) {
  return {
    $modal,
    config,
    name,
    type: SHOW_MODAL,
  }
}

export default modal

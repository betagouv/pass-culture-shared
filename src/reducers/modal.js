export const CLOSE_MODAL = 'CLOSE_MODAL'
export const SHOW_MODAL = 'SHOW_MODAL'
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE'

const initialState = {
  config: { fromDirection: 'right' },
  isActive: false,
  $modal: null,
}

export function modal(state = initialState, action) {
  switch (action.type) {
    case CLOSE_MODAL:
      return Object.assign({}, state, {
        isActive: false,
      })
    case LOCATION_CHANGE:
      return Object.assign({}, state, {
        isActive: false,
      })
    case SHOW_MODAL:
      return Object.assign({}, state, {
        config: action.config,
        $modal: action.$modal,
        isActive: true,
      })
    default:
      return state
  }
}

export function closeModal() {
  return { type: CLOSE_MODAL }
}

export function showModal($modal, config) {
  return {
    config,
    $modal,
    type: SHOW_MODAL,
  }
}

export default modal

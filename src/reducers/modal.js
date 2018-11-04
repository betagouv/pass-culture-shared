export const CLOSE_MODAL = 'CLOSE_MODAL'
export const SHOW_MODAL = 'SHOW_MODAL'

const initialState = {
  $modal: null,
  config: { fromDirection: 'right' },
  isActive: false,
}

export function modal(state = initialState, action) {
  switch (action.type) {
    case CLOSE_MODAL:
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
    $modal,
    config,
    type: SHOW_MODAL,
  }
}

export default modal

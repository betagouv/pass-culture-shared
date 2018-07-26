const initialState = {}

export const MERGE_FORM = 'MERGE_FORM'
export const RESET_FORM = 'RESET_FORM'

export const form = (state = initialState, action) => {
  switch (action.type) {
    case MERGE_FORM:
      const nextPatch = Object.assign({}, state[action.name])
      for (let key of Object.keys(action.patch)) {
        const nextValue = action.patch[key]
        if (nextValue === '' || Number.isNaN(nextValue)) {
          if (nextPatch[key]) {
            delete nextPatch[key]
          }
          continue
        }
        nextPatch[key] = nextValue
      }
      return Object.assign({}, state, {
        [action.name]: nextPatch
      })
    case RESET_FORM:
      return initialState
    default:
      return state
  }
}

export const mergeForm = (name, patch, config) => ({
  type: MERGE_FORM,
  name,
  patch,
  config
})

export const resetForm = () => ({
  type: RESET_FORM
})

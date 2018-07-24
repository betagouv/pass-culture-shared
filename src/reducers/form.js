import get from 'lodash.get'

const initialState = {}

export const MERGE_FORM_DATA = 'MERGE_FORM_DATA'
export const RESET_FORM = 'RESET_FORM'

export const form = (state = initialState, action) => {
  switch (action.type) {
    case MERGE_FORM_DATA:
      const nextData = Object.assign({}, get(state, `${action.name}.data`))
      for (let key of Object.keys(action.data)) {
        const nextValue = action.data[key]
        if (nextValue === '' || Number.isNaN(nextValue)) {
          if (nextData[key]) {
            delete nextData[key]

          }
          continue
        }
        nextData[key] = nextValue
      }
      return Object.assign({}, state, {
        [action.name]: Object.assign({}, state[action.name], {
          data: nextData
        })
      })
    case RESET_FORM:
      return initialState
    default:
      return state
  }
}

export const mergeFormData = (name, data, config) => ({
  type: MERGE_FORM_DATA,
  name,
  data,
  config
})

export const resetForm = () => ({
  type: RESET_FORM
})

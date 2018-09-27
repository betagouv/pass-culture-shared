import merge from 'lodash.merge'

import { isObject } from '../utils/object'

const initialState = {}

export const RESET_FORM = 'RESET_FORM'

export const form = (state = initialState, action) => {
  if (/MERGE_FORM_(.*)/.test(action.type)) {

    const nextPatch = Object.assign({}, state[action.name])

    for (let key of Object.keys((action.patch || {}))) {

      const nextValue = action.patch[key]

      // THE CASE WHERE THE USER DELETED ALL THE CARACTERS
      // IN THE INPUT FIELD
      // WE NEED HERE TO COMPLETELY DELETE THE CORRESPONDING ITEM
      // IN THE FORM
      if (nextValue === '' || Number.isNaN(nextValue)) {
        if (nextPatch[key]) {
          delete nextPatch[key]
        }
        continue
      }

      // IF THE VALUE IS AN OBJECT, WE MERGE IT WITH THE PREVIOUS
      // VALUE, ELSE WE JUST SET IT
      if (isObject(nextValue)) {
        nextPatch[key] = merge({}, nextPatch[key], nextValue)
      } else {
        nextPatch[key] = nextValue
      }

    }

    return Object.assign({}, state, {
      [action.name]: nextPatch,
    })
  }

  if (action.type === RESET_FORM) {
    return initialState
  }
  
  return state
}

export const mergeForm = (name, patch, config) => ({
  type: `MERGE_FORM_${name.toUpperCase()}`,
  name,
  patch,
  config,
})

export const resetForm = () => ({
  type: RESET_FORM,
})

import merge from 'lodash.merge'

import { isObject } from '../utils/object'

const initialState = {}

export const MERGE_FORM = 'MERGE_FORM'
export const RESET_FORM = 'RESET_FORM'

export const form = (state = initialState, action) => {
  switch (action.type) {
    case MERGE_FORM:

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
  config,
})

export const resetForm = () => ({
  type: RESET_FORM,
})

export const SET_USER = 'SET_USER'

const initialState = null

export function user(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return action.patch
    default:
      return state
  }
}

export function setUser(patch) {
  return {
    patch,
    type: SET_USER,
  }
}

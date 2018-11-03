import { createSelector } from 'reselect'

export const selectCurrentUser = createSelector(
  state => state.data.users,
  users => users.find(user => user && user.isCurrent)
)

export default selectCurrentUser

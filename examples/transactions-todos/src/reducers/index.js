import { errors } from 'pass-culture-shared'
import { combineReducers } from 'redux'

import data from './data'
import filter from './filter'

const rootReducer = combineReducers({
  data,
  errors,
  filter
})

export default rootReducer

import createCachedSelector from 're-reselect'

import { queryStringToObject } from '../utils/string'

const emptySearch = {}

export default createCachedSelector(
  (state, search) => search,

  search => queryStringToObject(search) || emptySearch
)((state, search) => search || '')

import { parse } from 'query-string'
import createCachedSelector from 're-reselect'

function mapArgsToCacheKey(location) {
  return location.search
}

export const selectSearchFromLocation = createCachedSelector(
  location => location.search,
  search => parse(search)
)(mapArgsToCacheKey)

export default selectSearchFromLocation

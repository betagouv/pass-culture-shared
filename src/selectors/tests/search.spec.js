import createCachedSelector from '../search'

describe('createCachedSelector', () => {
  it('should select the seach from state', () => {
    const state = {}
    const search =
      '?mots-cles=conspiration&distance=50&latitude=48.863779099999995&longitude=2.3374663&page=1'

    const expected = {
      distance: '50',
      latitude: '48.863779099999995',
      longitude: '2.3374663',
      'mots-cles': 'conspiration',
      page: '1',
    }
    const result = createCachedSelector(state, search)

    expect(result).toEqual(expected)
  })
  it('should return an empty object when there is not search query in the state', () => {
    const state = {}
    const search = ''
    const expected = {}
    const result = createCachedSelector(state, search)

    expect(result).toEqual(expected)
  })
})

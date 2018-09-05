import { pluralize } from '../string'

describe('pluralize', () => {
  it('should return string with plural if many offers', () => {
    const plural = 'offres'
    expect(pluralize('offres', 5)).toEqual(plural)
  })
  it('should return string with plural if many offers', () => {
    const plural = '5 offres'
    expect(pluralize(5, 'offres')).toEqual(plural)
  })
  it('should return string with singular if 0 offer', () => {
    const singular = 'offre'
    expect(pluralize('offres', 0)).toEqual(singular)
  })
  it('should return string with singular if 0 offer', () => {
    const singular = '0 offre'
    expect(pluralize(0, 'offres')).toEqual(singular)
  })
  it('should return string with plural if 1 offer', () => {
    const singular = 'offre'
    expect(pluralize('offres', 1)).toEqual(singular)
  })
  it('should return string with plural if 1 offer', () => {
    const singular = '1 offre'
    expect(pluralize(1, 'offres')).toEqual(singular)
  })
})

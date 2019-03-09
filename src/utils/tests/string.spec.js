import {
  getRequestErrorStringFromErrors,
  objectToQueryString,
  pluralize,
  queryStringToObject,
} from '../string'

describe('getRequestErrorStringFromErrors', () => {
  const arrayOfObject1 = [{ global: 'toto' }]

  const arrayOfObject2 = [{ global: 'toto' }, { booking: 'titi' }]

  const objectWithArrays1 = {
    global: ['toto'],
  }

  const objectWithArrays2 = {
    booking: ['tata'],
    global: ['toto', 'titi'],
  }

  const noErrror = {}

  test('parse array of objects', () => {
    expect(getRequestErrorStringFromErrors(arrayOfObject1)).toBe('toto')
    expect(getRequestErrorStringFromErrors(arrayOfObject2)).toBe('toto titi')
  })

  test('parse hash with arrays', () => {
    expect(getRequestErrorStringFromErrors(objectWithArrays1)).toBe('toto')
    expect(getRequestErrorStringFromErrors(objectWithArrays2)).toBe('tata toto titi')
  })

  test('parse empty error', () => {
    expect(getRequestErrorStringFromErrors(noErrror)).toBe('')
  })
})

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

describe('objectToQueryString', () => {
  it('should return an empty string when it receive an empty object', () => {
    const fakeObject = {}
    expect(objectToQueryString(fakeObject)).toEqual('')
  })

  it('should return a fakeObject when it receive an object', () => {
    const fakeObject = {
      distance: 'fakeDistance',
      from_date: 'fakeDistance',
      keywords: 'fakeWords',
      type: 'fakeDistance',
    }
    expect(objectToQueryString(fakeObject)).toEqual(
      'distance=fakeDistance&from_date=fakeDistance&keywords=fakeWords&type=fakeDistance'
    )
  })
  it('should return an empty fakeObject when it receive an object with a value that is null', () => {
    const fakeObject = {
      keywords: null,
    }
    expect(objectToQueryString(fakeObject)).toEqual('')
  })
  it('should return an empty fakeObject when it receive an object with a value that is undefined', () => {
    const fakeObject = {
      keywords: undefined,
    }
    expect(objectToQueryString(fakeObject)).toEqual('')
  })
  it('should return an empty fakeObject when it receive an object with a value that is null', () => {
    const fakeObject = {
      keywords: null,
    }
    expect(objectToQueryString(fakeObject)).toEqual('')
  })
  it('should return a string when it receive an object with an number', () => {
    const fakeObject = {
      keywords: 12345,
    }
    expect(objectToQueryString(fakeObject)).toEqual('keywords=12345')
  })

  it('should return a string when given an object', () => {
    const location = {
      distance: '50',
      latitude: '48.863779099999995',
      longitude: '2.3374663',
      'mots-cles': 'conspiration',
      page: '1',
    }
    expect(objectToQueryString(location)).toEqual(
      'distance=50&latitude=48.863779099999995&longitude=2.3374663&mots-cles=conspiration&page=1'
    )
  })
})

describe('queryStringToObject', () => {
  // TODO La fonction doit-elle renvoyer un objet vide s'il n'y a pas de string valide ?
  // Elle n'est utilisée que dans le selectors/search
  it.skip('should return an empty object when given an empty string', () => {
    const queryString = ''
    expect(queryStringToObject(queryString)).toEqual({})
  })
  it.skip('should return an empty object when given an empty string', () => {
    const queryString = null
    expect(queryStringToObject(queryString)).toEqual({})
  })
  it.skip('should return an empty object when given an empty string', () => {
    const queryString = undefined
    expect(queryStringToObject(queryString)).toEqual({})
  })
  it('should return an empty object when given a string with query params', () => {
    const queryString =
      'distance=50&latitude=48.863779099999995&longitude=2.3374663&mots-cles=conspiration&page=1'
    const expected = {
      distance: '50',
      latitude: '48.863779099999995',
      longitude: '2.3374663',
      'mots-cles': 'conspiration',
      page: '1',
    }
    expect(queryStringToObject(queryString)).toEqual(expected)
  })
})

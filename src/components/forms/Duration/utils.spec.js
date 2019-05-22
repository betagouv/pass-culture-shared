import isValid from './utils';
import testIsValid from './isValidValues'


describe('src | components | form | duration | utils | isValid', () => {
  const limitTimeInHours = 2400
    testIsValid.forEach((test) =>  {
      const { value } = test
      const { text } = test
      const { valid } = test
        it(`should return ${text} when given ${value}`, () => {
          expect(isValid(value, limitTimeInHours)).toEqual(valid)
        })
    })
})

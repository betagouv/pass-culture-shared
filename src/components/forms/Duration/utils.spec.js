import isValid from '../utils';
import testIsValid from './isValidValues'
import {removeZeroWhenOneUnityAdded, addZeroToMinutesBelowTen} from "../utils";


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

describe('src | components | form | duration | utils | getMinutesBelowTen', () => {
  it('should format minutes when below then', () => {
    // given
    const value = "11:1"

    // when
    const result = addZeroToMinutesBelowTen(value, 1)

    // then
    expect(result).toEqual("11:01")
  })
})


describe('src | components | form | duration | utils | moveUnityAsDozen', () => {
  it('should format minutes when below then', () => {
    // given
    const value = "11:014"

    // when
    const result = removeZeroWhenOneUnityAdded(value)

    // then
    expect(result).toEqual("11:14")
  })
})

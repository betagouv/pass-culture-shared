import testIsValid from './isValidValues'
import isValid, { addMinutesToHours, addZeroToHoursBelowTen, addZeroToMinutesBelowTen, removeZeroFromMinutesWhenOneUnityAdded, removeZeroFromHoursWhenOneUnityAdded } from '../utils'

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
  it('should add a zero when unit below zero', () => {
    // given
    const value = "11:1"

    // when
    const result = addZeroToMinutesBelowTen(value, 1)

    // then
    expect(result).toEqual("11:01")
  })
})

describe('src | components | form | duration | utils | addMinutesToHours', () => {
  it('should add a zero when unit below zero', () => {
    // given
    const value = "05:4"

    // when
    const result = addMinutesToHours(value)

    // then
    expect(result).toEqual("54:")
  })
})


describe('src | components | form | duration | utils | removeZeroFromMinutesWhenOneUnityAdded', () => {
  it('should remove zero when one unit is added', () => {
    // given
    const value = "11:014"

    // when
    const result = removeZeroFromMinutesWhenOneUnityAdded(value)

    // then
    expect(result).toEqual("11:14")
  })
})

describe('src | components | form | duration | utils | removeZeroFromHoursWhenOneUnityAdded', () => {
  it('should remove zero at the beginning and transform it to hour', () => {
    // given
    const value = "O12"

    // when
    const result = removeZeroFromHoursWhenOneUnityAdded(value)

    // then
    expect(result).toEqual("12:")
  })
})


describe('src | components | form | duration | utils | addZeroToHoursBelowTen', () => {
  it('should add one zero as dozen', () => {
    // given
    const value = "7"

    // when
    const result = addZeroToHoursBelowTen(value)

    // then
    expect(result).toEqual("07:")
  })
  it('should add a zero', () => {
    // given
    const value = "0"

    // when
    const result = addZeroToHoursBelowTen(value)

    // then
    expect(result).toEqual("00:")
  })
})

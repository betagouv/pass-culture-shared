const isValid = (val, limitTimeInHours) => {

  console.log('value passed to isValied', val)

  var letterArr = val.split(':').join('').split(''),
  regexp = /^\d{0,2}?\:?\d{0,3}$/,
  valArr = []

  const [hoursStr, minutesStr] = val.split(':')


  console.log('value validate regexp', regexp.test(val))

  if (!regexp.test(val)) {
    return false
  }

  const hours = Number(hoursStr)
  const minutes = Number(minutesStr)

  const isValidHour = (hour) => Number.isInteger(hour) && hour >= 0 && hour < limitTimeInHours
  const isValidMinutes = (minute) => (Number.isInteger(minute) && hours >= 0 && hours < limitTimeInHours) || Number.isNaN(minutes)

  console.log('wwwwwww isValidMinutes', isValidMinutes(minutes))

  if (!isValidHour(hours) || !isValidMinutes(minutes)) {
    return false
  }

  if (minutes< 10 && Number(minutesStr[0]) > 5) {
    return false
  }

  if (valArr.indexOf(':')) {
    valArr = val.split(':')
  } else {
    console.log(' ??? inside push array')
    valArr.push(val)
  }

  if (valArr[0] && valArr[0].length && (parseInt(valArr[0], 10) < 0 || parseInt(valArr[0], 10) > limitTimeInHours)) {
    return false
  }


  if (valArr[1] && valArr[1].length && (parseInt(valArr[1], 10) < 0 || parseInt(valArr[1], 10) > 59 || valArr[1] === '00')) {
    console.log('59 %%%%%%% ', valArr[1])
    return false
  }

  return true
}

export const addZeroToMinutesBelowTen = (value, minutesDozen) => {
  const hours = value.slice(0, 2)
  console.log('huours in getMinutesBelowTen')
  return `${hours}:0${minutesDozen}`
}

export const removeZeroWhenOneUnityAdded = (value) => value.replace(':0', ':')

export default isValid

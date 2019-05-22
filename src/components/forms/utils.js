const isValid = (duration, limitTimeInHours) => {

  var letterArr = duration.split(':').join('').split(''),
  regexp = /^\d{0,4}?\:?\d{0,2}$/,
  durationArray = []

  const [hoursStr, minutesStr] = duration.split(':')

  if (!regexp.test(duration)) {
    return false
  }

  const hours = Number(hoursStr)
  const minutes = Number(minutesStr)

  const isValidHour = (hour) => Number.isInteger(hour) && hour >= 0 && hour < limitTimeInHours
  const isValidMinutes = (minute) => (Number.isInteger(minute) && hours >= 0 && hours < limitTimeInHours) || Number.isNaN(minutes)
  if (!isValidHour(hours) || !isValidMinutes(minutes)) {
    return false
  }

  if (minutes< 10 && Number(minutesStr[0]) > 5) {
    return false
  }

  if (durationArray.indexOf(':')) {
    durationArray = duration.split(':')
  } else {
    durationArray.push(duration)
  }

  if (durationArray[0] && durationArray[0].length && (parseInt(durationArray[0], 10) < 0 || parseInt(durationArray[0], 10) > limitTimeInHours)) {
    return false
  }


  if (durationArray[1] && durationArray[1].length && (parseInt(durationArray[1], 10) < 0 || parseInt(durationArray[1], 10) > 59 || durationArray[1] == '00')) {
    return false
  }

  return true
}

export default isValid

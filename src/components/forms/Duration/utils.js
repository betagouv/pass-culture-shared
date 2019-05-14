const isValid = (val, limitTimeInHours) => {
    let valArr = []
    const regexp = /^\d{0,2}?\:?\d{0,2}$/

    const [hoursStr, minutesStr] = val.split(':')

    if (!regexp.test(val)) {
        return false
    }

    const hours = Number(hoursStr)
    const minutes = Number(minutesStr)

    const isValidHour = (someHours) => Number.isInteger(someHours) && someHours >= 0 && someHours < limitTimeInHours

    const isValidMinutes = (someMinutes) => (Number.isInteger(someMinutes) && hours >= 0 && hours < limitTimeInHours) || Number.isNaN(minutes)


    if (!isValidHour(hours) || !isValidMinutes(minutes)) {
        return false
    }

    if (minutes< 10 && Number(minutesStr[0]) > 5) {
        return false
    }

    if (valArr.indexOf(':')) {
        valArr = val.split(':')
    } else {
        valArr.push(val)
    }

    if (valArr[0] && valArr[0].length && (parseInt(valArr[0], 10) < 0 || parseInt(valArr[0], 10) > 23)) {
        return false
    }

    if (valArr[1] && valArr[1].length && (parseInt(valArr[1], 10) < 0 || parseInt(valArr[1], 10) > 59)) {
        return false
    }

    return true
}
export default isValid

import PropTypes from 'prop-types'
import ReactTimeInput from 'react-time-input'

import isValid, { addMinutesToHours, addZeroToHoursBelowTen, addZeroToMinutesBelowTen, removeZeroFromMinutesWhenOneUnityAdded } from './utils'

class PatchedReactTimeInput extends ReactTimeInput {
  // onChangeHandler already existst in react-time-input
  // this.props.onTimeChange(value) pass to form the value that will be send to api when post or patch
  onChangeHandler(value) {
    const { limitTimeInHours } = this.props
    const { time } = this.state

    let changingDuration = value

    if (value === time) {
      return
    }

    const lastValLength = this.state.time.length
    const newValueLength = value.length

    const userIsAddingChars = newValueLength > lastValLength
    if (!(isValid(value, limitTimeInHours))) {
      return
    }

    const isColon = value.indexOf(':') === 2

    // ------------- 12:014 becomes 12:14-------------- /
    const areHoursGivenRegexp = /^\d{2}?\:0/

    if (areHoursGivenRegexp.test(value) && value.length === 6) {
      changingDuration = removeZeroFromMinutesWhenOneUnityAdded(value)
      this.props.onTimeChange(value)
    }

    if (value.length > 5) {
      return
    }

    const durationFirstChar = value.charAt(0)

    // ------------- 3 becomes 03:-------------
    if (value.length === 1 && Number(durationFirstChar) < 10 && Number(durationFirstChar) > 0) {
      changingDuration = addZeroToHoursBelowTen(durationFirstChar)
    }
    // ------------- 05:4 becomes 54: -------------- /
    if(value.length === 4 && durationFirstChar === '0' && time !== '') {
      changingDuration = addMinutesToHours(value)
    }

    const minutesDozen = Number(value.charAt(3))

    // user choose hour by himself in hours 01 becomes 01:00
    if(value.length === 2 && Number(value) < 9 && userIsAddingChars) {
      changingDuration = value + ':'
      if(Number(minutesDozen) < 10) {
        changingDuration = addZeroToMinutesBelowTen(value, minutesDozen)
      }
    }

    // ------------- 12:3 becomes 12:03-------------- /
    if (value.length === 4 && minutesDozen < 10 && minutesDozen > 0 && isColon && durationFirstChar != '0' ) {
      console.log('  *******3 addZeroToMinutesBelowTen')
        changingDuration = addZeroToMinutesBelowTen(value, minutesDozen)
    }

    this.lastVal = changingDuration

    this.setState({
      time: changingDuration
    })

    const isFieldEmpty = value === "" || value.length === 0

    if(isFieldEmpty) {
      this.props.onTimeChange(value)
    }

    const isMaxSizeForDuration = value.length === 5

    if (isMaxSizeForDuration) {
      this.props.onTimeChange(value)
    }
  }
}

PatchedReactTimeInput.defaultProps = {
  className: '',
  disabled: false,
  initTime: '',
  limitTimeInHours: 2400,
  mountFocus: false,
  name: 'duration',
  placeholder: 'HH:MM',
  type: 'duration',
}

PatchedReactTimeInput.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  initTime: PropTypes.string,
  limitTimeInHours: PropTypes.number,
  mountFocus: PropTypes.bool,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string
}

export default PatchedReactTimeInput

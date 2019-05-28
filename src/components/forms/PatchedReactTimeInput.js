import PropTypes from 'prop-types'
import ReactTimeInput from 'react-time-input'

import isValid, { addZeroToHoursBelowTen, addZeroToMinutesBelowTen, removeZeroFromMinutesWhenOneUnityAdded, removeZeroFromHoursWhenOneUnityAdded } from './utils'

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

    if (!(isValid(value, limitTimeInHours))) {
      return
    }

    const isTwoPoints = value.indexOf(':') === 2

    // ------------- 12:014 becomes 12:14-------------- /
    const areHoursGivenRegexp = /^\d{2}?\:0/

    if (areHoursGivenRegexp.test(value) && value.length === 6) {
      changingDuration = removeZeroFromMinutesWhenOneUnityAdded(value)
      this.props.onTimeChange(value)
    }

    if (value.length > 5) {
      return
    }

    // ------------- 012 becomes 12:-------------
    if (value.length === 3 && !isTwoPoints ) {
      changingDuration = removeZeroFromHoursWhenOneUnityAdded(value)
      this.props.onTimeChange(changingDuration)
    }

    const durationFirstChar = value.charAt(0)

    // ------------- 3 becomes 03:-------------
    if (value.length === 1 && Number(durationFirstChar) < 10 && Number(durationFirstChar) > 0) {
      changingDuration = addZeroToHoursBelowTen(durationFirstChar)
    }

    // ------------- 12:3 becomes 12:03-------------- /
    const minutesDozen = Number(value.charAt(3))
    if (value.length === 4 && minutesDozen < 10 && minutesDozen > 0 && isTwoPoints) {
        changingDuration = addZeroToMinutesBelowTen(value, minutesDozen)
    }

    // this.lastVal = changingDuration

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

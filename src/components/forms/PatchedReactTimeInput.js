import PropTypes from 'prop-types'
import ReactTimeInput from 'react-time-input'

import isValid from './utils'
import { addZeroToMinutesBelowTen, removeZeroWhenOneUnityAdded } from './utils'

class PatchedReactTimeInput extends ReactTimeInput {
  addTwoPoints = (value) => `${value}:`


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

    if (value.length > 5) {
      return
    }

    if (value.length === 2 && this.lastVal.length !== 3 && value.indexOf(':') === -1) {
      changingDuration = this.addTwoPoints(value)
    }

    if (value.length === 2 && this.lastVal.length === 3) {
      value = value.slice(0, 1)
    }



    // addZeroToMinutesBelowTen 11:5 > 11:05
    if (value.length === 4 ) {
    // if (this.lastVal.length == 4) {
      const minutesDozen = value.charAt(3)
      if (Number(minutesDozen) < 10 && Number(minutesDozen) > 0) {
        changingDuration = addZeroToMinutesBelowTen(value, minutesDozen)
        // problème > il accepte pas le 6 !! car dépasse la règle des minutes >59
        // ??? this.props.onTimeChange(value)
      }

    }
    // --------------------------- /
    const isMinutesBelowTenRegexp = /^\d{2}?\:0/

    // 11:056 > 11:56
    if (isMinutesBelowTenRegexp.test(value) && this.lastVal.length === 6) {
      changingDuration = removeZeroWhenOneUnityAdded(value)
      console.log('value when 11:07 et on rajoute un char', value)
      // on permet de dépasser 6 charactères
      this.props.onTimeChange(value)
    }

    // --------------------------- //

    this.lastVal = changingDuration

    this.setState({
      time: changingDuration
    })

    if(value === "" || value.length === 0) {
      this.props.onTimeChange(value)
    }

    if (value.length === 5) {
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

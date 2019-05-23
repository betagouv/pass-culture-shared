import PropTypes from 'prop-types'
import ReactTimeInput from 'react-time-input'

import isValid,{getMinutesBelowTen}  from './Duration/utils'



class RawDurationInput extends ReactTimeInput {




  onChangeHandler(value) {
    const {limitTimeInHours} = this.props
    const {time} = this.state

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
      changingDuration = `${value}:`
    }

    if (value.length === 2 && this.lastVal.length === 3) {
      console.log(' ****** indise value slice ', value)
      value = value.slice(0, 1);
    }

    const minutesDozen = value.charAt(3)

    if (minutesDozen < 10) {
      const toto = getMinutesBelowTen(value, minutesDozen)
      log('toto >>> ', toto)
    }

    if (value.length === 4) {
      console.log('value slice ', value.slice(4, 5))
    }


    this.lastVal = changingDuration


    //   if(minutesDozen && value.length === 6 ) {
    //  supprime le zéro et renvoie la valeur
    // }

      console.log('lastVal', this.lastVal)

      this.setState({
        time: changingDuration
      })

      if (value.length === 5) {
          this.props.onTimeChange(value)
      }
    }
}

RawDurationInput.defaultProps = {
  className: '',
  disabled: false,
  initTime: '',
  limitTimeInHours: 2400,
  mountFocus: false,
  name: 'duration',
  placeholder: 'HH:MM',
  type: 'duration',
}

RawDurationInput.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  initTime: PropTypes.string,
  limitTimeInHours: PropTypes.number,
  mountFocus: PropTypes.bool,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string
}

export default RawDurationInput

import PropTypes from 'prop-types'
import ReactTimeInput from 'react-time-input'

import isValid from './Duration/utils'

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
      value = value.slice(0, 1);
    }

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
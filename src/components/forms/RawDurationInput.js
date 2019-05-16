import PropTypes from 'prop-types'
import ReactTimeInput from 'react-time-input'

import isValid from './Duration/utils'

class RawDurationInput extends ReactTimeInput {

  onChangeHandler(value) {
    const { limitTimeInHours } = this.props
    const { time } = this.state

    if (value === time) {
      return;
    }

    if (!(isValid(value, limitTimeInHours))) {
      return
    }
      this.setState({
        time: value
      })

      const regexp = /^\d{0,4}(|\:\d{2})$/
      if (regexp.test(value)) {
        this.props.onTimeChange(value);
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

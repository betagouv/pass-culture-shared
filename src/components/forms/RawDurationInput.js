import React, { Component } from 'react'
import PropTypes from 'prop-types'

import isValid from './Duration/utils'

// Refactoring from https://github.com/dima-bu/react-time-input

class RawDurationInput extends Component {

    constructor(props) {
        super(props)
        const { initTime } = this.props
        this.state = {
            time: initTime|| ''
        }
        this.lastVal = ''
    }

    componentDidMount() {
        const { disabled, mountFocus } = this.props
        if (!disabled && mountFocus) {
            setTimeout(()=> {
                this._input.focus()
            }, 0)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.initTime) {
            this.onChangeHandler(nextProps.initTime)
        }
    }

    componentDidUpdate(){
      const { mountFocus } = this.props
        if (mountFocus) {
            setTimeout(()=> {
                this._input.focus()
            }, 0)
        }
    }


    onChangeHandler (val) {
        const { limitTimeInHours } = this.props
        const { time } = this.state
        let newTime

        if (val === time) {
            return
        }

        const validatedValue = isValid(val, limitTimeInHours)


        if (validatedValue) {
            if (val.length > 5) {
                return
            }

            if (val.length === 2 && this.lastVal.length !== 3 && val.indexOf(':') === -1) {
                newTime = `${val}:`
            }

            if (val.length === 2 && this.lastVal.length === 3) {
                newTime = val.slice(0, 1)
            }



            this.lastVal = val

            this.setState({
                time: newTime
            })

            if (val.length === 5) {
                this.props.onTimeChange(val)
            }

        }

    }

    render () {
      const {
        className,
        disabled,
        placeholder,
        type,
        name
      } = this.props

      const { time } = this.state

        return (
          <input
            name={name}
            className={className}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
            value={time}
            onChange={(e) => this.onChangeHandler(e.target.value)}
            onFocus={(this.props.onFocusHandler)?(e) => this.props.onFocusHandler(e):undefined}
            onBlur={(this.props.onBlurHandler)? (e) => this.props.onBlurHandler(e):undefined}
            ref={(c) => this._input = c}
          />
        )
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

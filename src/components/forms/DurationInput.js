/* eslint-disable */
import React, { Component } from 'react'
import RawDurationInput from './RawDurationInput'
import ReactTimeInput from 'react-time-input'
import isValid from "./utils"
import PropTypes from "prop-types"


class DateInput extends ReactTimeInput {
  onChangeHandler(value) {
    // patch of OnchangeHandler from ReactTimeInput imported component
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

    const hoursGiven = value.length === 2

    if (hoursGiven && this.lastVal.length !== 3 && value.indexOf(':') === -1) {
      changingDuration = `${value}:`
    }

    if (value.length === 2 && this.lastVal.length === 3) {
      console.log('********** before the slice ', value)
      value = value.slice(0, 1)
      console.log('********* value : ', value)
    }


    if(value.length === 4) {
      console.log('>>>>>>>>>>', value.slice(4,5))
    }

/*
    this.lastVal = changingDuration

    this.setState({
      time: changingDuration
    })
*/

    // console.log('************ last val *******', this.lastVal)


    if (value.length === 5) {
      this.props.onTimeChange(value)
    }
  }

  onChange = duration => {
    const { onChange: fieldOnChange, getDurationInMinutes } = this.props
    const value = duration
    let valueInMinutes

    if (value.length >= 0 && typeof value === 'string') {
      valueInMinutes = getDurationInMinutes(value)
    } else {
      valueInMinutes = value
    }

    fieldOnChange(valueInMinutes)
  }

  render() {
    const {
      getDurationInHours,
      limitTimeInHours,
      placeholder,
      readOnly,
      size,
      value,
    } = this.props

    let valueInHours
    if (value && typeof value === 'number') {
      valueInHours = getDurationInHours(value)
    } else {
      valueInHours = value
    }

    if (readOnly) {
      return (
        <input
        className={`input is-${size}`}
        readOnly
        value={valueInHours}
        />
      )
    }

    return (
      <RawDurationInput
      className="field-input field-duration"
      placeholder={placeholder}
      initTime={valueInHours}
      limitTimeInHours={limitTimeInHours}
      onTimeChange={this.onChange}
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


export default DateInput

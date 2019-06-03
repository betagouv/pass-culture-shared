/* eslint-disable */
import React, { Component } from 'react'
import PatchedReactTimeInput from './PatchedReactTimeInput'

class DateInput extends Component {
  onChange = duration => {
    const { onChange: fieldOnChange, getDurationInMinutes } = this.props
    const value = duration
    let valueInMinutes = value

    if (value.length >= 0 &&  typeof value === 'string') {
      valueInMinutes = getDurationInMinutes(value)
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

    let valueInHours = valueInHours
    if (value && typeof value === 'number') {
      valueInHours = getDurationInHours(value)
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
      <PatchedReactTimeInput
      className="field-input field-duration"
      placeholder={placeholder}
      initTime={valueInHours}
      limitTimeInHours={limitTimeInHours}
      onTimeChange={this.onChange}
      />
    )
  }
}

export default DateInput

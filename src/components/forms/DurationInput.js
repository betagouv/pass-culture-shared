/* eslint-disable */
import React, { Component } from 'react'
import RawDurationInput from './RawDurationInput'

class DateInput extends Component {
  onChange = duration => {
    const { onChange: fieldOnChange, getDurationInMinutes } = this.props
    const value = duration
    let valueInHours

    if (value && typeof value === 'string') {
      valueInHours = getDurationInMinutes(value)
    } else {
      valueInHours = value
    }
    fieldOnChange(value, valueInHours)
  }

  render() {
    const {
      durationMinutes,
      getDurationInHours,
      limitTimeInHours,
      placeholder,
      readOnly,
      size,
      value,
      limitTime
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
      <div className={`input is-${size} duration`}>
        <span>
        <RawDurationInput
          className="field-input field-duration"
          placeholder={placeholder}
          initTime={valueInHours}
          // limitTimeInHours={limitTimeInHours ? limitTimeInHours : 24}
          limitTimeInHours={limitTimeInHours}
          onTimeChange={this.onChange}
        />
        </span>
      </div>
    )
  }
}

export default DateInput

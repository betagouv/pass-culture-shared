/* eslint-disable */
import React, { Component } from 'react'
import ReactTimeInput from 'react-time-input'

class DateInput extends Component {
  onChange = duration => {
    const { onChange: fieldOnChange } = this.props
    const value = duration
    fieldOnChange(value, { event: { target: { value } } })
  }

  render() {
    const {
      placeholder,
      readOnly,
      size,
      value,
      durationMinutes,
    } = this.props

    if (readOnly) {
      return (
        <input
          className={`input is-${size}`}
          readOnly
          value={value}
        />
      )
    }

    return (
      <div className={`input is-${size} duration`}>
        <span>
        <ReactTimeInput
          className="duration"
          placeholder={placeholder}
          initTime={durationMinutes}
          onTimeChange={this.onChange}
        />
        </span>
      </div>
    )
  }
}

export default DateInput

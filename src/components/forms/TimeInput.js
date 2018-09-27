import moment from 'moment-timezone'
import React, { Component } from 'react'
import ReactTimeInput from 'react-time-input';

class TimeInput extends Component {
  static displayValue = (value, props) => {
    const { tz } = props || {}
    return value && tz && moment(value).tz(tz)
  }

  onInputChange = time => {
    const { onChange: fieldOnChange, value, tz } = this.props
    if (fieldOnChange && value) {
      console.log('value', value, 'event.target.value', time)
      const [hour, minutes] = time.split(':')
      const date = moment(value).tz(tz)
        .hours(hour)
        .minutes(minutes)
      fieldOnChange(
        date && date.toISOString(),
        { event: { target: { value: time } } }
      )
    }
  }

  render() {
    const {
      readOnly,
      value,
      size,
      tz
    } = this.props

    const timezonedValue = (value && tz)
      ? moment(value).tz(tz).format('HH:mm')
      : ''

    if (readOnly) {
      return (
        <input
          className={`input is-${size}`}
          readOnly
          value={timezonedValue} />
      )
    }

    return (
      <ReactTimeInput
   			initTime={timezonedValue}
   			className={`input is-${size}`}
   			mountFocus='true'
   			onTimeChange={this.onInputChange}
      />
    )
  }
}

export default TimeInput

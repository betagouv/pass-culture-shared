import moment from 'moment'
import React, { Component } from 'react'

import BasicInput from './BasicInput'

class TimeInput extends Component {
  static displayValue = (value, props) => {
    const { tz } = props || {}
    return value && tz && moment(value).tz(tz)
  }

  onInputChange = event => {
    const { onChange: fieldOnChange, value } = this.props
    if (fieldOnChange && value) {
      const [hour, minutes] = event.target.value.split(':')
      const date = moment(value)
        .hours(hour)
        .minutes(minutes)
      fieldOnChange(date && date.toISOString(), { event })
    }
  }

  render() {
    const { value } = this.props

    return (
      <BasicInput
        {...this.props}
        onChange={this.onInputChange}
        value={value ? moment(value).format('HH:mm') : ''}
      />
    )
  }
}

export default TimeInput

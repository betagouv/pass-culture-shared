import moment from 'moment'
import React, { Component } from 'react'

import BasicInput from './BasicInput'

class TimeInput extends Component {

  static displayValue = (value, props) => {
    const { tz } = (props || {})
    return value && tz && moment(value).tz(tz)
  }

  onInputChange = e => {
    const { onChange, value, tz } = this.props
    if (onChange && value) {
      const [hour, minutes] = e.target.value.split(':')
      const date = moment(value)
        .hours(hour)
        .minutes(minutes)
      onChange(date && date.toISOString())
    }
  }

  render () {
    const { value } = this.props

    return (
      <BasicInput {...this.props}
        onChange={this.onInputChange}
        value={
          value
            ? moment(value).format('HH:mm')
            : ''
        }/>
    )
  }
}

export default TimeInput

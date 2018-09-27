import moment from 'moment'
import React, { Component } from 'react'
import DatePicker from 'react-datepicker'

import Icon from '../Icon'

class DateInput extends Component {
  onChange = date => {
    const { onChange: fieldOnChange } = this.props
    const value = date.toISOString()
    fieldOnChange(value, { event: { target: { value } } })
  }

  render() {
    const {
      dateFormat,
      filterDate,
      highlightedDates,
      id,
      maxDate,
      minDate,
      readOnly,
      size,
      value,
    } = this.props

    if (readOnly) {
      return <input
        className={`input is-${size}`}
        readOnly
        value={value && moment(value).format(dateFormat)} />
    }

    return (
      <div className={`input is-${size} date-picker`}>
        <span>
          <DatePicker
            className="date"
            dateFormat={dateFormat}
            filterDate={filterDate}
            highlightDates={(highlightedDates || []).map(d => moment(d))}
            id={id}
            minDate={
              minDate === 'today' ? moment() : minDate && moment(minDate)
            }
            maxDate={
              maxDate === 'today' ? moment() : maxDate && moment(maxDate)
            }
            onChange={this.onChange}
            readOnly={readOnly}
            selected={value ? moment(value) : null}
          />
        </span>
        <span className="icon">
          <Icon alt="Horaires" className="input-icon" svg="ico-calendar" />
        </span>
      </div>
    )
  }
}

DateInput.defaultProps = {
  dateFormat: 'DD/MM/YYYY',
}

export default DateInput

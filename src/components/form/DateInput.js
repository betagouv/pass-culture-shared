import moment from 'moment'
import React, { Component } from 'react'
import DatePicker from 'react-datepicker'

import Icon from '../Icon'

class DateInput extends Component {
  onChange = date => {
    const { onChange: fieldOnChange } = this.props
    fieldOnChange(date.toISOString())
  }

  render() {
    const {
      dateFormat,
      filterDate,
      highlightedDates,
      maxDate,
      minDate,
      readOnly,
      size,
      value,
    } = this.props

    return readOnly ? (
      <span className={`label is-${size}`}>
        {value && moment(value).format(dateFormat)}
      </span>
    ) : (
      <div className={`input is-${size} date-picker`}>
        <span>
          <DatePicker
            className="date"
            filterDate={filterDate}
            highlightDates={(highlightedDates || []).map(d => moment(d))}
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

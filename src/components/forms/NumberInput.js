import React, { Component } from 'react'

import BasicInput from './BasicInput'

class NumberInput extends Component {
  static displayValue = (value) =>
    value === 0 ? 0 : value

  formatValue = value => {
    const { step } = this.props

    if (!value || isNaN(Number(value))) {
      return ''
    }

    // FIXME first test should be handled with defautProps
    if (step && step < 1) {
      return parseFloat(value)
    }

    return parseInt(value, 10)
  }

  onChange = event => {
    const { onChange: fieldOnChange } = this.props
    const value = this.formatValue(event.target.value)
    fieldOnChange(value, { event })
  }

  render() {
    const { value } = this.props
    return (
      <BasicInput
        {...this.props}
        onChange={this.onChange}
        type={typeof value === 'string' ? 'text' : 'number'}
      />
    )
  }
}

export default NumberInput

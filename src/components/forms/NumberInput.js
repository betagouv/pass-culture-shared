import React, { Component } from 'react'

import BasicInput from './BasicInput'

class NumberInput extends Component {
  static displayValue = (value, props) => {
    return value === 0 ? 0 : value
  }

  formatValue = value => {
    if (!value || isNaN(Number(value))) {
      return ""
    }

    // FIXME first test should be handled with defautProps
    if (this.props.step && this.props.step < 1) {
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
    return (
      <BasicInput
        {...this.props}
        onChange={this.onChange}
        type={typeof this.props.value === 'string' ? 'text' : 'number'}
      />
    )
  }
}

export default NumberInput

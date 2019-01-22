import React, { Component } from 'react'

import BasicInput from './BasicInput'

class NumberInput extends Component {
  static displayValue = (value) =>
    value === 0 ? 0 : value

  formatValue = value => {
    const { floatFixed, floatSep, step } = this.props
    const lastChar = value.slice(-1)[0]

    if (lastChar === floatSep) {
      return value
    }

    const otherFloatSep = floatSep === ',' ? '.' : ','
    if (lastChar === otherFloatSep || Number.isNaN(Number(lastChar))) {
      return value.slice(0, -1)
    }

    if (!value || Number.isNaN(Number(value.replace(',', '.')))) {
      return ''
    }

    let floatValueString = value
    if (floatSep === ',') {
      floatValueString = value.replace('.', ',')
    }
    if ((step && step < 1) || floatValueString.includes(floatSep)) {
      const [integer, decimal] = floatValueString.split(floatSep)
      const fixed = decimal.length
      const floatValueWithDot = value
                                  .replace(',', '.')
                                  .slice(0, integer.length + floatFixed + 1)
      const floatValue = parseFloat(floatValueWithDot)
                                  .toFixed(Math.min(fixed, floatFixed))
      if (floatSep === ',') {
        return String(floatValue).replace('.', ',')
      }
      return String(floatValue)
    }

    return String(parseInt(value, 10))
  }

  onChange = event => {
    const { target: { value } } = event
    const { onChange: fieldOnChange } = this.props
    const formatedValue = this.formatValue(value)
    event.persist()
    fieldOnChange(formatedValue, { event })
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

NumberInput.defaultProps = {
  floatFixed: 2,
  floatSep: '.'
}

export default NumberInput

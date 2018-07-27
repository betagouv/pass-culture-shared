import React, { Component } from 'react'

import BasicInput from './BasicInput'

class NumberInput extends Component {

  static displayValue = (value, props) => {
    return value === 0 ? 0 : value
  }

  onChange = e => {
    const value = e.target.value
      ? parseInt(e.target.value, 10)
      : 0
    e.target.value = value
    this.props.onChange(value)
  }

  render () {
    return (
      <BasicInput {...this.props}
        onChange={this.onChange}
        type='number' />
    )
  }
}

export default NumberInput

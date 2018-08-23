import React, { Component } from 'react'

import BasicInput from './BasicInput'

class NumberInput extends Component {
  static displayValue = (value, props) => {
    return value === 0 ? 0 : value
  }

  onChange = event => {
    const { onChange: fieldOnChange } = this.props
    const value = event.target.value
      ? parseInt(event.target.value, 10) 
      : 0
    event.target.value = value
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

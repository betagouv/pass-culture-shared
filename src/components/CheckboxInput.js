import React, { Component } from 'react'

import BasicInput from './BasicInput'

class CheckboxInput extends Component {

  onChange = e => {
    this.props.onChange(e.target.checked)
  }

  render () {
    const {
      readOnly,
      value
    } = this.props

    console.log('RENDER value', value)

    return (
      <BasicInput {...this.props}
        className='input'
        checked={value}
        disabled={readOnly}
        onChange={this.onChange}
        type='checkbox' />
    )
  }
}

export default CheckboxInput

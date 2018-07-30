import React, { Component } from 'react'

import BasicInput from './BasicInput'

class CheckboxInput extends Component {
  onChange = e => {
    const { onChange: fieldOnChange } = this.props
    fieldOnChange(e.target.checked)
  }

  render() {
    const { readOnly, value } = this.props

    return (
      <BasicInput
        {...this.props}
        className="input"
        checked={value}
        disabled={readOnly}
        onChange={this.onChange}
        type="checkbox"
      />
    )
  }
}

export default CheckboxInput

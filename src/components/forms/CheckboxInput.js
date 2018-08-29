import React, { Component } from 'react'

import BasicInput from './BasicInput'

class CheckboxInput extends Component {
  onChange = event => {
    event.persist()
    const { onChange: fieldOnChange } = this.props
    fieldOnChange(event.target.checked, { event })
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

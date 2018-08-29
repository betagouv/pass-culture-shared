import React, { Component } from 'react'
import Textarea from 'react-autosize-textarea'

class TextareaInput extends Component {

  onChange = event => {
    const {
      maxLength,
      onChange: fieldOnChange,
    } = this.props

    if (maxLength && event.target.value.length > maxLength) {
      return
    }

    fieldOnChange(event.target.value, { event })
  }

  render () {
    const {
      autoComplete,
      id,
      name,
      required,
      readOnly,
      size,
      type,
      value
    } = this.props

    return (
      <Textarea
        aria-describedby={this.props['aria-describedby']}
        autoComplete={autoComplete}
        className={`textarea is-${size}`}
        id={id}
        name={name}
        required={required}
        type={type}
        value={value}
        onChange={this.onChange}
        readOnly={readOnly}
      />
    )
  }
}

export default TextareaInput

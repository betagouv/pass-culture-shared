import React, { Component } from 'react'
import Textarea from 'react-autosize-textarea'

class TextareaInput extends Component {
  static defaultProps = {
    rows: 1,
  }

  onChange = event => {
    const { onChange: fieldOnChange } = this.props

    fieldOnChange(event.target.value, { event })
  }

  render() {
    const {
      autoComplete,
      id,
      maxLength,
      name,
      required,
      readOnly,
      rows,
      size,
      type,
      value,
    } = this.props

    return (
      <Textarea
        aria-describedby={this.props['aria-describedby']}
        autoComplete={autoComplete}
        className={`textarea is-${size}`}
        id={id}
        maxlength={maxLength}
        name={name}
        onChange={this.onChange}
        required={required}
        type={type}
        readOnly={readOnly}
        rows={rows}
        value={value}
      />
    )
  }
}

export default TextareaInput

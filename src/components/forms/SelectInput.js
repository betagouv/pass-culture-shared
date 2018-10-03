import classnames from 'classnames'
import get from 'lodash.get'
import React, { Component } from 'react'

import { optionify } from '../../utils/form'

class SelectInput extends Component {
  componentDidMount() {
    this.handleSpecialOptions()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.options !== this.props.options) {
      this.handleSpecialOptions()
    }
  }

  handleSpecialOptions = () => {
    const { onChange: fieldOnChange, options, optionValue } = this.props
    if (options && options.length === 1) {
      fieldOnChange(options[0][optionValue])
      return
    }

    console.log('qdqdq', options.length)
    if (!options || options.length === 0) {
      console.log('ON Y VA', this.props.name)
      fieldOnChange('')
    }
  }

  onChange = event => {
    const { onChange: fieldOnChange } = this.props
    event.persist()
    fieldOnChange(event.target.value, { event })
  }

  render() {
    const {
      autoComplete,
      id,
      name,
      optionLabel,
      optionValue,
      options,
      placeholder,
      readOnly,
      required,
      type,
      size,
      value,
    } = this.props

    const actualReadOnly = readOnly || options.length === 1
    const actualOptions = optionify(
      options.map(o => ({
        label: get(o, optionLabel),
        value: get(o, optionValue),
      })),
      placeholder
    )

    return (
      <div
        className={classnames(`select is-${size}`, {
          readonly: actualReadOnly,
        })}>
        <select
          aria-describedby={this.props['aria-describedby']}
          autoComplete={autoComplete}
          id={id}
          name={name}
          required={required}
          type={type}
          value={value}
          onChange={this.onChange}
          disabled={actualReadOnly}>
          {actualOptions.filter(o => o).map(({ label, value }, index) => (
            <option key={index} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    )
  }
}

SelectInput.defaultProps = {
  optionValue: 'id',
  optionLabel: 'name',
}

export default SelectInput

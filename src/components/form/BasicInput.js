import React from 'react'

const BasicInput = props => {
  const {
    autoComplete,
    checked,
    disabled,
    id,
    name,
    onChange,
    readOnly,
    required,
    type,
    size,
    value
  } = props

  return <input
    aria-describedby={props['aria-describedby']}
    autoComplete={autoComplete}
    checked={checked}
    className={`input is-${size}`}
    disabled={disabled}
    id={props.id}
    name={name}
    onChange={onChange}
    required={required}
    readOnly={readOnly}
    type={type}
    value={value} />
}

export default BasicInput

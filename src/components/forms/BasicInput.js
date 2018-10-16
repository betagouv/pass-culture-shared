import React, { Fragment } from 'react'

const BasicInput = props => {
  const {
    autoComplete,
    checked,
    className,
    disabled,
    id,
    name,
    onChange,
    readOnly,
    renderInfo,
    required,
    type,
    size,
    value,
    min,
    step,
  } = props

  return (
    <Fragment>
      <input
        aria-describedby={props['aria-describedby']}
        autoComplete={autoComplete}
        checked={checked}
        className={className || `input is-${size}`}
        disabled={disabled}
        id={id}
        name={name}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
        type={type}
        value={value}
        min={min}
        step={step}
      />
      {renderInfo && renderInfo()}
    </Fragment>
  )
}

export default BasicInput

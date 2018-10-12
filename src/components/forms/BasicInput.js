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
    value,
  } = props

  return (
    <Fragment>
      <input
        aria-describedby={props['aria-describedby']}
        autoComplete={autoComplete}
        checked={checked}
        className={className || 'input'}
        disabled={disabled}
        id={id}
        name={name}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
        type={type}
        value={value}
      />
      {renderInfo && renderInfo()}
    </Fragment>
  )
}

export default BasicInput

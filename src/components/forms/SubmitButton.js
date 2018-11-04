import classnames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'

const SubmitButton = ({
  children,
  className,
  isLoading,
  getTitle,
  getDisabled,
  requiredFields,
  ...otherProps
}) => (
  <button
    {...otherProps}
    className={classnames(className, { 'is-loading': isLoading })}
    disabled={getDisabled()}
    title={getTitle()}
    type="button"
  >
    {children}
  </button>
)

SubmitButton.defaultProps =  {
  children: null,
  getDisabled: () => true,
  getTitle: () => null,
  requiredFields: [],
  type: 'submit',
}

SubmitButton.propTypes = {
  children: PropTypes.node,
  getDisabled: PropTypes.func,
  getTitle: PropTypes.func,
  requiredFields: PropTypes.array,
  type: PropTypes.string
}

// NEEDED FOR MINIFY BUILD TIME
// BECAUCE c.type.displayName DISAPPEAR OTHERWISE
SubmitButton.displayName = 'SubmitButton'

export default SubmitButton

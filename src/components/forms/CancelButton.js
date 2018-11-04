import PropTypes from 'prop-types'
import React from 'react'

const CancelButton = ({ children, ...otherProps }) => (
  <button {...otherProps} type="button">
    {children}
  </button>
)

CancelButton.defaultProps = {
  children: null,
}

CancelButton.propTypes = {
  children: PropTypes.node
}

// NEEDED FOR MINIFY BUILD TIME
// BECAUCE c.type.displayName DISAPPEAR OTHERWISE
CancelButton.displayName = 'CancelButton'

export default CancelButton

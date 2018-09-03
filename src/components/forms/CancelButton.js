import React from 'react'

const CancelButton = ({ children, requiredFields, ...otherProps }) => {
  return <button {...otherProps}>{children}</button>
}

// NEEDED FOR MINIFY BUILD TIME
// BECAUCE c.type.displayName DISAPPEAR OTHERWISE
CancelButton.displayName = 'CancelButton'

export default CancelButton

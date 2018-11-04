import classnames from 'classnames'
import React, { Component } from 'react'

class SubmitButton extends Component {
  static defaultProps = {
    requiredFields: [],
    getDisabled: () => true,
    getTitle: () => null,
    type: 'submit',
  }

  render() {
    const {
      children,
      className,
      isLoading,
      getTitle,
      getDisabled,
      requiredFields,
      ...otherProps
    } = this.props

    return (
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
  }
}

// NEEDED FOR MINIFY BUILD TIME
// BECAUCE c.type.displayName DISAPPEAR OTHERWISE
SubmitButton.displayName = 'SubmitButton'

export default SubmitButton

import React, { Component } from 'react'

export class SubmitButton extends Component {

  static defaultProps = {
    requiredFields: [],
    getDisabled: () => true,
    getTitle: () => null,
    type: 'submit',
  }

  render () {
    const {
      children,
      getTitle,
      getDisabled,
      requiredFields,
      ...otherProps,
    } = this.props
    return (
      <button {...otherProps} title={getTitle()} disabled={getDisabled()}>
        {children}
      </button>
    )
  }
}

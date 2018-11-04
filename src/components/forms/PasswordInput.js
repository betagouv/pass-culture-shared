import React, { Component } from 'react'

import BasicInput from './BasicInput'
import { Icon } from '../Icon'

class PasswordInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isPasswordHidden: true,
    }
  }

  toggleHidden = e => {
    e.preventDefault()
    this.setState(previousState => ({
      isPasswordHidden: !previousState.isPasswordHidden,
    }))
  }

  onInputChange = event => {
    const { onChange: fieldOnChange } = this.props
    event.persist()
    fieldOnChange(event.target.value, { event })
  }

  render() {
    const { noPasswordToggler, ...otherProps } = this.props
    const { isPasswordHidden } = this.state

    const input = (
      <BasicInput
        {...otherProps}
        type={isPasswordHidden ? 'password' : 'text'}
        onChange={this.onInputChange}
      />
    )
    if (noPasswordToggler) return input
    return (
      <div className="field has-addons password">
        <div className="control is-expanded">{input}</div>
        <div className="control">
          <button
            className="button is-rounded"
            onClick={this.toggleHidden}
            type="button"
          >
            <Icon
              svg={isPasswordHidden ? 'ico-eye close' : 'ico-eye'}
            />
            &nbsp;
          </button>
        </div>
      </div>
    )
  }
}

PasswordInput.defaultProps = {
  noPasswordToggler: false,
}

export default PasswordInput

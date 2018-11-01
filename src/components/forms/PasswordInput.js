import React, { Component } from 'react'

import BasicInput from './BasicInput'
import Icon from '../Icon'

class PasswordInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isPasswordHidden: true,
    }
  }

  static defaultProps = {
    noPasswordToggler: false,
  }

  toggleHidden = e => {
    e.preventDefault()
    this.setState({
      isPasswordHidden: !this.state.isPasswordHidden,
    })
  }

  onInputChange = event => {
    const { onChange: fieldOnChange } = this.props
    event.persist()
    fieldOnChange(event.target.value, { event })
  }

  render() {
    const { noPasswordToggler, ...otherProps } = this.props
    const input = (
      <BasicInput
        {...otherProps}
        type={this.state.isPasswordHidden ? 'password' : 'text'}
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
              svg={this.state.isPasswordHidden ? 'ico-eye close' : 'ico-eye'}
            />
            &nbsp;
          </button>
        </div>
      </div>
    )
  }
}

export default PasswordInput

import classnames from 'classnames'
import PropTypes from 'prop-types'
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
    const { noPasswordToggler, info, ...otherProps } = this.props
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
      <div className="field has-addons field-password">
        <div className="control is-expanded">{input}</div>
        <div className={classnames("control", "with-info")}>
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
        {info && (
          <span
            className='column is-2'
            data-place='bottom'
            data-tip={info}
            data-type='info'
          >
            <Icon svg="picto-info" />
          </span>
        )}
      </div>
    )
  }
}

PasswordInput.defaultProps = {
  info: null,
  noPasswordToggler: false
}

PasswordInput.propTypes = {
  info: PropTypes.string,
  noPasswordToggler: PropTypes.bool
}

export default PasswordInput

import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import { closeModal } from '../reducers/modal'
import { requestData } from '../reducers/data'

class SignoutButton extends Component {

  handleFail = () => {
    const { handleFail, handleFailRedirect, history } = this.props
    if (handleFail) {
      handleFail(this.props)
      return
    }

    const redirect = handleFailRedirect && handleFailRedirect()
    if (redirect) {
      history.push(redirect)
    }
  }

  handleSuccess = () => {
    const { handleSuccess, handleSuccessRedirect, history } = this.props
    if (handleSuccess) {
      handleSuccess(this.props)
      return
    }

    const redirect = handleSuccessRedirect && handleSuccessRedirect()
    if (redirect) {
      history.push(redirect)
    }
  }

  onSignoutClick = () => {
    const { dispatch } = this.props
    dispatch(
      requestData('GET', 'users/signout', {
        handleFail: this.handleFail,
        handleSuccess: this.handleSuccess,
        name: 'signout',
      })
    )
    dispatch(closeModal())
  }

  render() {
    const { children, className, Tag } = this.props
    return (
      <Tag onClick={this.onSignoutClick} className={className}>
        {children}
      </Tag>
    )
  }
}


SignoutButton.defaultProps = {
  Tag: 'button',
  children: null,
  className: null,
  handleFail: null,
  handleFailRedirect: null,
  handleSuccess: null,
  handleSuccessRedirect: null,
}

SignoutButton.propTypes = {
  Tag: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  handleFail: PropTypes.func,
  handleFailRedirect: PropTypes.func,
  handleSuccess: PropTypes.func,
  handleSuccessRedirect: PropTypes.func,
  history: PropTypes.object.isRequired
}

export default compose(withRouter, connect())(SignoutButton)

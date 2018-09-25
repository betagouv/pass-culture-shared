import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import { closeModal } from '../reducers/modal'
import { requestData } from '../reducers/data'

class SignoutButton extends Component {
  static defaultProps = {
    Tag: 'button',
  }

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

  handleSignoutError = () => {
    const { error, history } = this.props
    if (error) {
      history.push('/connexion')
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
        name: 'signout'
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

export default withRouter(SignoutButton)

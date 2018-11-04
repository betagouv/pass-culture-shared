import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import { requestData } from '../../reducers/data'

const withLogin = (config = {}) => WrappedComponent => {
  const { failRedirect, isRequired, successRedirect } = config

  class _withLogin extends PureComponent {
    constructor() {
      super()
      this.state = { canRenderChildren: false }
    }

    componentDidMount = () => {
      const { dispatch, history, location, user } = this.props
      const { canRenderChildren } = this.state

      // we are logged already so cool
      // we can render children
      if (user !== null && !canRenderChildren) {
        this.setState({ canRenderChildren: true })
      }

      dispatch(
        requestData('GET', `users/current`, {
          handleFail: () => {
            if (failRedirect) {
              let computedFailRedirect = failRedirect
              if (typeof failRedirect === 'function') {
                computedFailRedirect = successRedirect(this.props)
              }
              if (computedFailRedirect === location.pathname) {
                return
              }
              history.push(computedFailRedirect)
            }

            // if the login failed and that the login
            // is not required we can still render what
            // is in the page
            if (!isRequired) {
              this.setState({ canRenderChildren: true })
            }
          },
          handleSuccess: () => {
            if (successRedirect) {
              let computedSuccessRedirect = successRedirect
              if (typeof successRedirect === 'function') {
                computedSuccessRedirect = successRedirect(this.props)
              }
              if (computedSuccessRedirect === location.pathname) {
                return
              }
              history.push(computedSuccessRedirect)
              return
            }
            this.setState({ canRenderChildren: true })
          },
        })
      )
    }

    render() {
      const { canRenderChildren } = this.state
      if (!canRenderChildren) {
        return null
      }
      return <WrappedComponent {...this.props} />
    }
  }

  _withLogin.defaultProps = {
    user: null,
  }

  _withLogin.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    user: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  }

  return compose(withRouter, connect(state => ({ user: state.user })))(
    _withLogin
  )
}

export default withLogin

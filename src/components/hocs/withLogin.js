import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import { selectCurrentUser } from '../../selectors'
import { requestData } from '../../reducers/data'

const withLogin = (config = {}) => WrappedComponent => {
  const { failRedirect, isRequired, successRedirect } = config

  class _withLogin extends PureComponent {
    constructor() {
      super()
      this.state = { canRenderChildren: false }
    }

    componentDidMount = () => {
      const { currentUser, dispatch, history, location } = this.props
      const { canRenderChildren } = this.state

      // we are logged already, so it is already cool:
      // we can render children
      if (currentUser !== null && !canRenderChildren) {
        this.setState({ canRenderChildren: true })
      }

      dispatch(
        requestData("GET", "users/current", {
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
            history.push(computedSuccessRedirect)
            return
          }
          this.setState({ canRenderChildren: true })
        },
        resolve: nextDatum => Object.assign({ isCurrent: true }, nextDatum)
      }))
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
    currentUser: null,
  }

  _withLogin.propTypes = {
    currentUser: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  }

  return compose(withRouter, connect(state => ({ currentUser: selectCurrentUser(state) })))(
    _withLogin
  )
}

export default withLogin

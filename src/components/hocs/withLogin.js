import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

import { requestData } from '../../reducers/data'

const withLogin = (config = {}) => WrappedComponent => {
  const { failRedirect, isRequired, successRedirect } = config

  class _withLogin extends Component {
    constructor(props) {
      super(props)
      this.isRequired = isRequired || Boolean(props.handleDataRequest)
    }

    componentDidMount = () => {
      const { history, location, user, requestData } = this.props

      if (user === null && this.isRequired) {
        requestData('GET', `users/current`, {
          key: 'users',
          handleSuccess: () => {
            if (successRedirect && successRedirect !== location.pathname)
              history.push(successRedirect)
          },
          handleFail: () => {
            console.log('')
            if (failRedirect && failRedirect !== location.pathname)
              history.push(failRedirect)
          },
        })
      }
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
  return compose(
    withRouter,
    connect(state => ({ user: state.user }), { requestData })
  )(_withLogin)
}

export default withLogin

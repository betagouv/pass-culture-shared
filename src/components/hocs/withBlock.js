import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

export const blockersByName = {}

const withBlock = WrappedComponent => {
  class _withBlock extends Component {

    handleHistoryBlock = () => {
      const { history } = this.props

      this.unblock && this.unblock()

      this.unblock = history.block(nextLocation => {

        if (!Object.keys(blockersByName).length) {
          return true
        }

        // test all the blockersByName
        for (let blocker of Object.values(blockersByName)) {
          const shouldBlock = blocker && blocker(nextLocation, this.unblock)
          if (shouldBlock) {
            return false
          }
        }
        // return true by default, which means that we don't block
        // the change of pathname
        return true
      })
    }

    componentDidMount() {
      this.handleHistoryBlock()
    }

    render () {
      return <WrappedComponent {...this.props} blockersByName={blockersByName} />
    }
  }

  return withRouter(_withBlock)
}

export default withBlock

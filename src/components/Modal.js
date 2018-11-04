import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import { Icon } from './Icon'
import { closeModal } from '../reducers/modal'

const initialState = {
  display: false,
  translate: true,
}

class Modal extends Component {
  constructor() {
    super()
    this.state = initialState
  }

  componentDidMount() {
    this.handleActiveChange()
  }

  componentDidUpdate(prevProps) {
    const {
      dispatch,
      isClosingOnLocationChange,
      location: { pathname },
    } = this.props
    if (isClosingOnLocationChange && pathname !== prevProps.location.pathname) {
      dispatch(closeModal())
    }

    this.handleActiveChange(prevProps)
  }

  componentWillUnmount() {
    if (this.openTimeout) {
      clearTimeout(this.openTimeout)
    }
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout)
    }
  }

  handleActiveChange = (prevProps = {}) => {
    const { isActive, transitionDuration } = this.props

    if (isActive && !prevProps.isActive) {
      // Opening
      this.setState({
        display: true,
      })
      this.openTimeout = setTimeout(() => {
        this.setState({
          translate: false,
        })
      }, transitionDuration)
      document.addEventListener('backbutton', this.onCloseClick)
    } else if (!isActive && prevProps.isActive) {
      // Closing
      this.setState({
        translate: true,
      })
      this.closeTimeout = setTimeout(() => {
        this.setState({
          display: false,
        })
      }, transitionDuration)
      document.removeEventListener('backbutton', this.onCloseClick)
    }
  }

  onCloseClick = event => {
    const { dispatch, isActive, isUnclosable, onCloseClick } = this.props

    if (isUnclosable || !isActive) return true
    if (onCloseClick) {
      onCloseClick()
    }
    dispatch(closeModal())
    event.preventDefault()
    return event
  }

  stopPropagation = event => {
    event.nativeEvent.stopImmediatePropagation() // Prevent click bubbling and closing modal
    event.stopPropagation()
    return event
  }

  transform() {
    const { fromDirection } = this.props
    const { translate } = this.state

    if (!translate) return ''
    switch (fromDirection) {
      case 'top':
        return 'translate(0, -100vh)'
      case 'bottom':
        return 'translate(0, 100vh)'
      case 'left':
        return 'translate(-100vw, 0)'
      case 'right':
        return 'translate(100vw, 0)'
      default:
        return {}
    }
  }

  render() {
    const {
      fullscreen,
      hasCloseButton,
      isUnclosable,
      maskColor,
      $modal,
      transitionDuration,
    } = this.props
    const { display } = this.state

    return (
      <div
        className={classnames('modal', {
          active: display,
        })}
        role="dialog"
        style={{ backgroundColor: maskColor }}
        onClick={this.onCloseClick}
      >
        <div
          className={classnames('modal-dialog', {
            fullscreen,
          })}
          onClick={e => this.stopPropagation(e)}
          role="document"
          style={{
            transitionDuration: `${transitionDuration}ms`,
            transform: this.transform(),
          }}
        >
          {!isUnclosable &&
            hasCloseButton && (
              <button
                className="close"
                onClick={this.onCloseClick}
                type="button"
              >
                <Icon svg="ico-close-b" />
              </button>
            )}
          {$modal &&
            $modal.type && <div className="modal-content">{$modal}</div>}
        </div>
      </div>
    )
  }
}

Modal.defaultProps = {
  $modal: null,
  fromDirection: 'bottom',
  fullscreen: false,
  hasCloseButton: true,
  isActive: false,
  isClosingOnLocationChange: null,
  isUnclosable: false,
  maskColor: 'rgba(0, 0, 0, 0.8)',
  onCloseClick: null,
  transitionDuration: 250,
}

Modal.propTypes = {
  $modal: PropTypes.node,
  dispatch: PropTypes.func.isRequired,
  fromDirection: PropTypes.string,
  fullscreen: PropTypes.bool,
  hasCloseButton: PropTypes.bool,
  isActive: PropTypes.bool,
  isClosingOnLocationChange: PropTypes.func,
  isUnclosable: PropTypes.bool,
  location: PropTypes.object.isRequired,
  maskColor: PropTypes.string,
  onCloseClick: PropTypes.func,
  transitionDuration: PropTypes.number
}

function mapStateTopProps (state) {
  const { modal: { config, $modal, isActive } } = state
  return Object.assign({ $modal, isActive }, config)
}

export default compose(
  withRouter,
  connect(mapStateTopProps)
)(Modal)

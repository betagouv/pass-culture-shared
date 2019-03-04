import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { closeModal } from 'redux-react-modals'

export const Block = ({
  cancelText,
  confirmText,
  dispatch,
  history,
  modalName,
  nextLocation,
  text,
  unblock
}) => {
  const { pathname, search } = nextLocation
  return (
    <div>
      <div className="subtitle">{text}</div>
      <div className="level">
        <button
          className="button is-primary level-item"
          onClick={() => {
            dispatch(closeModal(modalName))
            unblock()
            history.push(`${pathname}${search}`)
          }}
          type='button'
        >
          {confirmText}
        </button>
        <button
          className="button is-secondary level-item"
          onClick={() => {
            dispatch(closeModal(modalName))
          }}
          type='button'
        >
          {cancelText}
        </button>
      </div>
    </div>
  )
}

Block.defaultProps = {
  cancelText: 'Non',
  confirmText: 'Oui',
  modalName: 'main',
  text: 'Êtes vous surs de vouloir quitter la page ?',
}

Block.propTypes = {
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  modalName: PropTypes.string,
  nextLocation: PropTypes.object.isRequired,
  text: PropTypes.string,
  unblock: PropTypes.func.isRequired
}

export default compose(withRouter, connect())(Block)

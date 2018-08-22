import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import { closeModal } from '../reducers/modal'

const Block = ({
  dispatch,
  history,
  nextLocation,
  text,
  unblock
}) => {
  const {
    pathname,
    search
  } = nextLocation
  return (
    <div>
      <div className="subtitle">
        {text}
      </div>
      <div className="level">
        <button
          className="button is-primary level-item"
          onClick={() => {
            dispatch(closeModal())
            unblock()
            history.push(`${pathname}${search}`)
          }}>
          Oui
        </button>
        <button
          className="button is-secondary level-item"
          onClick={closeModal}>
          Non
        </button>
      </div>
    </div>
  )
}

Block.defaultProps = {
  text: "Êtes vous surs de vouloir quitter la page ?"
}

export default compose(
  withRouter,
  connect(),
)(Block)

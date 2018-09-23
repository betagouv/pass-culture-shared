import { requestData } from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'

class TodoItem extends Component {

  onCompletedClick = () => {
    const { dispatch, todo } = this.props
    const { completed, id } = todo

    dispatch(requestData(
      'PATCH',
      `todos/${id}`,
      {
        body: {
          completed: !completed
        }
      }
    ))
  }

  render () {
    const { todo } = this.props
    const { name } = todo
    return (
      <li>
        <span> {name} </span>
        <button> Hello </button> 
      </li>
    )
  }
}

export default connect(
  (state, ownProps) => ({

  })
)(TodoItem)

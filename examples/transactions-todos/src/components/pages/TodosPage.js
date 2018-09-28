import { requestData } from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import AddTodo from './todos/AddTodo'
import VisibleTodosList from './todos/VisibleTodosList'
import Footer from './todos/Footer'
import todosNormalizer from '../../normalizers/todosNormalizer'

class TodosPage extends Component {

  componentDidMount() {
    this.props.dispatch(requestData('GET', 'todos', {
      normalizer: todosNormalizer
    }))
  }

  render () {
    const { todosError, globalError } = this.props

    if (todosError) {
      return (
        <div className="is-warning">
          {/* something like 'You are not authorized to fetch todos' */}
          {todosError}
        </div>
      )
    }

    if (globalError) {
      return (
        <div className="is-danger">
        {/* something like 'Connection to the server has failed' */}
          {globalError}
        </div>
      )
    }

    return (
      <div>
        <AddTodo />
        <VisibleTodosList />
        <Footer />
      </div>
    )
  }
}

export default connect(
  state => ({
    todosError: state.errors.todos,
    globalError: state.errors.global
  })
)(TodosPage)

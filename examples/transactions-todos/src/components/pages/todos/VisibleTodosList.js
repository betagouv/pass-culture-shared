import React, { Component } from 'react'
import Todo from './Todo'

class VisibleTodosList extends Component {

  onToggleAllTodosClick = () => {

  }

  render () {
    todos,
    onCancelTodoClick,
    onDestroyTodoClick,
    onEditTodoClick,
    onSaveTodoClick,
    onToggleTodoClick,
    onToggleAllTodosClick
  } => {
  const activeTodoCount = todos.reduce((accum, todo) => {
    return todo.completed ? accum : accum + 1
  }, 0)
  return (<section className='main'>
    <input
      className='toggle-all'
      type='checkbox'
      onChange={() => onToggleAllTodosClick(
        todos.map(todo => todo.id), activeTodoCount === 0)
      }
      checked={activeTodoCount === 0}
    />
    <ul className='todo-list'>
      {todos.map(todo =>
        <Todo
          key={todo.id}
          {...todo}
          onCancel={() => onCancelTodoClick(todo.id)}
          onClick={() => onToggleTodoClick(todo.id)}
          onEdit={() => onEditTodoClick(todo.id)}
          onDestroy={() => onDestroyTodoClick(todo.id)}
          onToggle={() => onToggleTodoClick(todo.id, todo.completed)}
          onSave={(text) => onSaveTodoClick(todo.id, text)}
        />
      )}
    </ul>
  </section>)
}

VisibleTodosList.propTypes = {
  onCancelTodoClick: PropTypes.func.isRequired,
  onDestroyTodoClick: PropTypes.func.isRequired,
  onEditTodoClick: PropTypes.func.isRequired,
  onSaveTodoClick: PropTypes.func.isRequired,
  onToggleTodoClick: PropTypes.func.isRequired,
  onToggleAllTodosClick: PropTypes.func.isRequired,
  todos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired).isRequired
}

export default VisibleTodosList

import get from 'lodash.get'
import uuid from 'uuid'

import todos from './todos'

function fetchData (method, path, config) {

  console.log('method, path, config', method, path, config)

  if (/todos\/(.*)$/.test(path)) {

    if (method === 'GET') {
      return { data: todos  }
    }

    if (method === 'POST') {
      const todo = Object.assign({ id: uuid() }, config.body)
      todos.push(todo)
      return { data: todos  }
    }

    if (method === 'PATCH') {
      const todoId = get(path.match(/todos\/(.*)$/), '0')
      if (todoId) {
        const todo = todos.find(todo => todo.id === todoId)
        Object.assign(todo, config.body)
        return { data: todo  }
      }
      return { todo: "No such todo id"  }
    }

    if (method === 'DELETE') {
      const todoId = get(path.match(/todos\/(.*)$/), '0')
      if (todoId) {
        const todoIndex = todos.findIndex(todo => todo.id === todoId)
        delete todos[todoIndex]
        return { data: { id: todoId }  }
      }
      return { todo: "No such todo id"  }
    }

  } else if (method === 'PATCH') {
    const videoId = get(path.match(/videos\/(.*)$/), '0')
    if (videoId) {
      for (let channel of todos) {
        for (let video of channel.videos) {
          if (video.id === videoId) {
            Object.assign(video, config.body)
            return { data: video  }
          }
        }
      }
    }
  }

  return { global: "No such path " }
}

export default fetchData

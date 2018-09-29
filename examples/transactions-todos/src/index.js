import { registerCacheWorker } from 'pass-culture-shared'
import React from 'react'
import ReactDOM from 'react-dom'

import './utils/init'
import Root from './Root'

console.log('registerCacheWorker', registerCacheWorker)

const initApp = () => {
  ReactDOM.render(<Root />, document.getElementById('root'))
  registerCacheWorker()
}

initApp()

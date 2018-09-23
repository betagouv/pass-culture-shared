import React from 'react'
import ReactDOM from 'react-dom'

import './utils/init'
import Root from './Root'
import registerCacheWorker from './workers/cache'

const initApp = () => {
    ReactDOM.render(<Root />, document.getElementById('root'))
    registerServiceWorker()
}

initApp()

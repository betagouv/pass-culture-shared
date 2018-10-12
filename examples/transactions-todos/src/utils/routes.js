import React from 'react'
import { Redirect } from 'react-router'

import TodosPage from '../_f_pages/TodosPage'

const routes = [
    {
        path: '/',
        render: () => <Redirect to="/todos" />,
    },
    {
        component: TodosPage,
        path: '/todos',
        title: "Todos example",
    },
]

export default routes

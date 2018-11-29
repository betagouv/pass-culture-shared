import get from 'lodash.get'
import { parse, stringify } from 'query-string'
import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'

const withPaginationRouter = (config = {}) => WrappedComponent => {

  const { windowToApiQuery } = config
  const defaultWindowQuery = Object.assign(
    { page: "1" },
    config.defaultWindowQuery,
  )
  const defaultWindowQueryString = parse(defaultWindowQuery)
  const defaultApiQuery = windowToApiQuery
    ? windowToApiQuery(defaultWindowQuery)
    : Object.assign({}, defaultWindowQuery)
  const defaultApiSearch = parse(defaultApiQuery)

  class _withPaginationRouter extends PureComponent {
    constructor() {
      super()

      const paginationData = {
        apiQuery: defaultApiQuery,
        apiQueryString: defaultApiSearch,
        value: null,
        windowQuery: defaultWindowQuery,
        windowQueryString: defaultWindowQueryString,
      }

      const paginationMethods = {
        add: this.add,
        change: this.change,
        orderBy: this.orderBy,
        remove: this.remove,
        reverseOrder: this.reverseOrder,
        setPage: this.setPage,
      }

      this.state = {
        ...paginationData,
        ...paginationMethods
      }
    }

    componentDidMount() {
      const { windowQuery } = this.state

      const mountWindowQuery = {}
      Object.keys(defaultWindowQuery).forEach(key => {
        mountWindowQuery[key] =
          typeof windowQuery[key] !== 'undefined'
            ? windowQuery[key]
            : defaultWindowQuery[key]
      })

      mountWindowQuery.page = null

      this.change(mountWindowQuery)
    }

    static getDerivedStateFromProps(nextProps) {

      const search = parse(nextProps.location.search)

      const windowQuery = {}

      Object.keys(defaultWindowQuery).forEach(key => {
        if (search[key]) {
          windowQuery[key] = search[key]
          return
        }
        if (search[key]) {
          windowQuery[key] = search[key]
        }
      })
      const windowQueryString = stringify(
        Object.assign({}, windowQuery)
      )

      const apiQuery = windowToApiQuery
        ? windowToApiQuery(windowQuery)
        : Object.assign({}, windowQuery)
      const apiQueryString = stringify(apiQuery)

      return {
        apiQuery,
        apiQueryString,
        windowQuery,
        windowQueryString,
      }
    }

    clear = () => {
      const { history, location } = this.props
      this.setState({ windowQuery: defaultWindowQuery })
      history.push(location.pathname)
    }

    reverseOrder = () => {
      const { windowQuery } = this.state
      const { orderBy } = windowQuery || {}
      if (!orderBy) {
        console.warn('there is no orderBy in the window query')
        return
      }
      const [orderName, orderDirection] = orderBy.split('+')
      this.change({
        orderBy: [orderName, orderDirection === 'desc' ? 'asc' : 'desc'].join(
          '+'
        ),
      })
    }

    orderBy = e => {
      const { windowQuery } = this.state
      const { orderBy } = windowQuery || {}
      if (!orderBy) {
        console.warn('there is no orderBy in the window query')
        return
      }
      const [, orderDirection] = orderBy.split('+')
      this.change({
        orderBy: [e.target.value, orderDirection].join('+'),
      })
    }

    change = (newValue, changeConfig = {}) => {
      const { history, location } = this.props
      const pathname = changeConfig.pathname || location.pathname
      const { windowQuery } = this.state

      const hasKeyNotInWindowQuery = Object.keys(newValue).find(
        key => typeof defaultWindowQuery[key] === 'undefined'
      )

      if (hasKeyNotInWindowQuery) {
        console.warn(
          'You tried to change the window query with a not specified key'
        )
        return
      }

      const newWindowQuery = {}
      Object.keys(defaultWindowQuery).forEach(key => {
        if (newValue[key]) {
          newWindowQuery[key] = newValue[key]
          return
        }
        if (newValue[key] !== null && windowQuery[key]) {
          newWindowQuery[key] = windowQuery[key]
        }
      })
      const newWindowSearch = stringify(newWindowQuery)

      const newPath = `${pathname}?${newWindowSearch}`

      const nextState = {
        value: newValue,
      }

      this.setState(nextState)

      history.push(newPath)
    }

    add = (key, value) => {
      const { windowQuery } = this.state

      let nextValue = value
      const previousValue = windowQuery[key]
      if (get(previousValue, 'length')) {
        const args = previousValue.split(',').concat([value])
        args.sort()
        nextValue = args.join(',')
      } else if (typeof previousValue === 'undefined') {
        console.warn(
          `Weird did you forget to mention this ${key} query param in your withPaginationRouter hoc ?`
        )
      }

      this.change({ [key]: nextValue })
    }

    remove = (key, value) => {
      const { windowQuery } = this.state

      const previousValue = windowQuery[key]
      if (get(previousValue, 'length')) {
        let nextValue = previousValue
          .replace(`,${value}`, '')
          .replace(value, '')
        if (nextValue[0] === ',') {
          nextValue = nextValue.slice(1)
        }
        this.change({ [key]: nextValue })
      } else if (typeof previousValue === 'undefined') {
        console.warn(
          `Weird did you forget to mention this ${key} query param in your withPaginationRouter hoc ?`
        )
      }
    }

    render() {
      return <WrappedComponent {...this.props} pagination={this.state} />
    }
  }

  return withRouter(_withPaginationRouter)
}

export default withPaginationRouter

import get from 'lodash.get'
import { parse, stringify } from 'query-string'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import { assignData } from '../../reducers/data'
import { selectSearchFromLocation } from '../../selectors'

const withPaginationRouter = (config = {}) => WrappedComponent => {

  const { dataKey, windowToApiQuery } = config
  const defaultWindowQuery = config.defaultWindowQuery || {}
  const defaultWindowQueryString = parse(defaultWindowQuery)
  const defaultApiQuery = windowToApiQuery
    ? windowToApiQuery(defaultWindowQuery)
    : Object.assign({}, defaultWindowQuery)
  const defaultApiSearch = parse(defaultApiQuery)

  class _withPaginationRouter extends Component {
    constructor(props) {
      super()

      const paginationData = {
        apiQuery: defaultApiQuery,
        apiQueryString: defaultApiSearch,
        page: 1,
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

      props.dispatch(assignData({ [dataKey]: [] }))
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

      this.change(mountWindowQuery)
    }

    static getDerivedStateFromProps(nextProps) {

      const search = selectSearchFromLocation(nextProps.location)

      const windowQuery = {}

      Object.keys(defaultWindowQuery).forEach(key => {
        windowQuery[key] = search[key] || defaultWindowQuery[key]
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

    setPage = page => {
      this.setState({ page })
    }

    clear = () => {
      const { history, location } = this.props
      this.setState({ windowQuery: defaultWindowQuery })
      history.push(location.pathname)
    }

    reverseOrder = e => {
      const orderBy = get(this, 'state.windowQuery.orderBy')
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
      const orderBy = get(this, 'state.windowQuery.orderBy')
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
      const { dispatch, history, location } = this.props
      const resetPage = changeConfig.page || 1
      const isClearingData =
        typeof changeConfig.isClearingData === 'undefined'
          ? true
          : changeConfig.isClearingData
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
        newWindowQuery[key] =
          typeof newValue[key] !== 'undefined'
            ? newValue[key]
            : windowQuery[key]
      })
      const newWindowSearch = stringify(newWindowQuery)

      const newPath = `${pathname}?${newWindowSearch}`

      if (isClearingData) {
        dispatch(assignData({ [dataKey]: [] }))
      }

      this.setState({
        value: newValue,
        page: resetPage,
      })

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

  return compose(withRouter, connect())(_withPaginationRouter)
}

export default withPaginationRouter

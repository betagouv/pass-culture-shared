import get from 'lodash.get'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import { assignData } from '../../reducers/data'
import searchSelector from '../../selectors/search'
import { objectToQueryString } from '../../utils/string'

const withPagination = (config = {}) => WrappedComponent => {

  const { dataKey, windowToApiQuery } = config
  const defaultWindowQuery = config.defaultWindowQuery || {}
  const defaultWindowQueryString = objectToQueryString(defaultWindowQuery)
  const defaultApiQuery = windowToApiQuery
    ? windowToApiQuery(defaultWindowQuery)
    : Object.assign({}, defaultWindowQuery)
  const defaultApiSearch = objectToQueryString(defaultApiQuery)

  class _withPagination extends Component {
    constructor(props) {
      super()

      this.state = {
        apiQuery: defaultApiQuery,
        apiQueryString: defaultApiSearch,
        page: 1,
        value: null,
        windowQuery: defaultWindowQuery,
        windowQueryString: defaultWindowQueryString,

        add: this.add,
        change: this.change,
        goToNextPage: this.goToNextPage,
        orderBy: this.orderBy,
        reverseOrder: this.reverseOrder,
        remove: this.remove
      }

      props.dispatch(assignData({ [dataKey]: [] }))

    }

    componentDidMount () {

      const { search } = this.props
      const { windowQuery } = this.state

      const resetPage = search.page
        ? Number(search.page)
        : 1

      const mountWindowQuery = {}
      Object.keys(defaultWindowQuery).forEach(key => {
        mountWindowQuery[key] = typeof windowQuery[key] !== "undefined"
          ? windowQuery[key]
          : defaultWindowQuery[key]
      })

      this.change(mountWindowQuery, { page: resetPage })

    }

    componentDidUpdate () {
      const { search } = this.props
      const { page } = this.state
      if (!search.page && page && page !== 1) {
        this.setState({ page: 1 })
      }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

      const windowQuery = {}
      Object.keys(defaultWindowQuery)
            .forEach(key => {
              windowQuery[key] = nextProps.search[key] || defaultWindowQuery[key]
            })
      const windowQueryString = objectToQueryString(
        Object.assign({}, windowQuery)
      )

      const apiQuery = windowToApiQuery
        ? windowToApiQuery(windowQuery)
        : Object.assign({}, windowQuery)
      const apiQueryString = objectToQueryString(apiQuery)

      return {
        apiQuery,
        apiQueryString,
        windowQuery,
        windowQueryString,
      }
    }

    goToNextPage = () => {
      const page = this.props.search.page ? Number(this.props.search.page) : 1
      this.setState(previousState => ({ page: page + 1 }))
    }

    clear = () => {
      const {
        history,
        location
      } = this.props
      this.setState({ windowQuery: defaultWindowQuery })
      history.push(location.pathname)
    }

    reverseOrder = e => {
      const orderBy =  get(this, 'state.windowQuery.orderBy')
      if (!orderBy) {
        console.warn('there is no orderBy in the window query')
        return
      }
      const [orderName, orderDirection] = orderBy.split('+')
      this.change({
        orderBy: [orderName, orderDirection === 'desc' ? 'asc' : 'desc'].join('+'),
      })
    }

    orderBy = e => {
      const orderBy =  get(this, 'state.windowQuery.orderBy')
      if (!orderBy) {
        console.warn('there is no orderBy in the window query')
        return
      }
      const [, orderDirection] = orderBy.split('+')
      this.change({
        orderBy: [e.target.value, orderDirection].join('+'),
      })
    }

    change = (newValue, config={}) => {
      const {
        dispatch,
        history,
        location
      } = this.props
      const resetPage = config.page || 1
      const isClearingData = typeof config.isClearingData === "undefined"
        ? true
        : config.isClearingData
      const pathname = config.pathname || location.pathname
      const { windowQuery } = this.state

      const hasKeyNotInWindowQuery = Object.keys(newValue)
        .find(key => typeof defaultWindowQuery[key] === "undefined")

      if (hasKeyNotInWindowQuery) {
        console.warn('You tried to change the window query with a not specified key')
        return
      }

      const newWindowQuery = {}
      Object.keys(defaultWindowQuery).forEach(key => {
        newWindowQuery[key] = typeof newValue[key] !== "undefined"
          ? newValue[key]
          : windowQuery[key]
      })
      const newWindowSearch = objectToQueryString(newWindowQuery)

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
      } else if (typeof previousValue === "undefined") {
       console.warn(`Weird did you forget to mention this ${key} query param in your withPagination hoc ?`)
      }

      this.change({ [key]: nextValue })

    }

    remove = (key, value) => {
      const { windowQuery } = this.state

      const previousValue = windowQuery[key]
      if (get(previousValue, 'length')) {
        let nextValue = previousValue.replace(`,${value}`, '')
                                       .replace(value, '')
        if (nextValue[0] === ',') {
          nextValue = nextValue.slice(1)
        }
        this.change({ [key]: nextValue })
      } else if (typeof previousValue === "undefined") {
        console.warn(`Weird did you forget to mention this ${key} query param in your withPagination hoc ?`)
      }
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          pagination={this.state}
        />
      )
    }
  }

  function mapStateToProps (state, ownProps) {
    return {
      search: searchSelector(state, ownProps.location.search)
    }
  }

  return compose(
    withRouter,
    connect(mapStateToProps)
  )(_withPagination)
}

export default withPagination

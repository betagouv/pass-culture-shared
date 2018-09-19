import get from 'lodash.get'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import { assignData } from '../../reducers/data'
import searchSelector from '../../selectors/search'
import { objectToQueryString } from '../../utils/string'

const withSearch = (config = {}) => WrappedComponent => {

  const { dataKey } = config
  const defaultQueryParams = config.defaultQueryParams || {}
  const keywordsQueryString = config.keywordsQueryString || 'keywords'

  class _withSearch extends Component {
    constructor(props) {
      super()
      this.state = {
        page: 1,
        queryParams: defaultQueryParams,
        value: null
      }
      props.assignData({ [dataKey]: [] })

    }

    static getDerivedStateFromProps(nextProps, prevState) {
      const queryParams = Object.assign(
        {},
        defaultQueryParams,
        nextProps.queryParams
      )

      const querySearch = objectToQueryString(
        Object.assign({}, queryParams, { page: prevState.page })
      )

      return {
        queryParams,
        querySearch,
        page: prevState.page,
      }
    }

    goToNextSearchPage = () => {
      this.setState(previousState => ({ page: previousState.page + 1 }))
    }

    handleClearQueryParams = () => {
      const {
        history,
        location
      } = this.props
      this.setState({
        queryParams: defaultQueryParams,
        search: undefined
      })
      history.push(location.pathname)
    }

    handleOrderDirectionChange = e => {
      const [by, direction] = this.state.queryParams.order_by.split('+')
      this.handleQueryParamsChange({
        order_by: [by, direction === 'desc' ? 'asc' : 'desc'].join('+'),
      })
    }

    handleOrderByChange = e => {
      const [, direction] = this.state.queryParams.order_by.split('+')
      this.handleQueryParamsChange({
        order_by: [e.target.value, direction].join('+'),
      })
    }

    handleQueryParamsChange = newValue => {
      const {
        assignData,
        history,
        location
      } = this.props
      const { queryParams, value } = this.state

      const queryObject = Object.assign({}, queryParams, newValue)

      const queryString = objectToQueryString(queryObject)

      const newPath = `${location.pathname}?${queryString}`

      // KEYWORDS HAS CHANGED SO WE NEED TO REFRESH THE PIPE
      if (
        get(newValue, keywordsQueryString) === null ||
        get(value, keywordsQueryString) !== get(newValue, keywordsQueryString)
      ) {
        assignData({ [dataKey]: [] })
      }

      this.setState({
        value: newValue,
        page: 1,
      })

      history.push(newPath)
    }

    handleQueryParamAdd = (key, value) => {
      const { queryParams } = this.state

      let nextValue = value
      const previousValue = queryParams[key]
      if (get(previousValue, 'length')) {
        nextValue = `${previousValue},${value}`
      } else if (typeof previousValue === "undefined") {
       console.warn(`Weird did you forget to mention this ${key} query param in your withSearch hoc ?`)
      }

      this.handleQueryParamsChange({ [key]: nextValue })

    }

    handleQueryParamRemove = (key, value) => {
      const { queryParams } = this.state

      const previousValue = queryParams[key]
      if (get(previousValue, 'length')) {
        let nextValue = previousValue.replace(`,${value}`, '')
                                       .replace(value, '')
        if (nextValue[0] === ',') {
          nextValue = nextValue.slice(1)
        }
        this.handleQueryParamsChange({ [key]: nextValue })
      } else if (typeof previousValue === "undefined") {
        console.warn(`Weird did you forget to mention this ${key} query param in your withSearch hoc ?`)
      }
    }

    handleRemoveFilter = key => e => {
      this.handleQueryParamsChange({ [key]: null })
    }

    handleKeywordsChange = e => {
      e.preventDefault()
      this.handleQueryParamsChange({ [keywordsQueryString]: e.target.elements.keywords.value })
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          handleClearQueryParams={this.handleClearQueryParams}
          handleKeywordsChange={this.handleKeywordsChange}
          handleOrderByChange={this.handleOrderByChange}
          handleOrderDirectionChange={this.handleOrderDirectionChange}
          handleQueryParamAdd={this.handleQueryParamAdd}
          handleQueryParamRemove={this.handleQueryParamRemove}
          handleQueryParamsChange={this.handleQueryParamsChange}
          handleRemoveFilter={this.handleRemoveFilter}
          goToNextSearchPage={this.goToNextSearchPage}
        />
      )
    }
  }

  return compose(
    withRouter,
    connect(
      (state, ownProps) => ({
        queryParams: searchSelector(state, ownProps.location.search)
      }),
      { assignData }
    )
  )(_withSearch)
}

export default withSearch

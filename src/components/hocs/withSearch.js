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
  const defaultQueryParams = config.defaultQueryParams || ({
    search: undefined,
    order_by: `createdAt+desc`,
  })

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

    handleQueryParamsChange = (newValue) => {
      const {
        assignData,
        history,
        location
      } = this.props
      const { queryParams, value } = this.state

      console.log('>>>>', newValue, queryParams)

      const newPath = `${location.pathname}?${objectToQueryString(
        Object.assign({}, queryParams, newValue)
      )}`
      if (get(value, 'search')!== get(newValue, 'search'))
        assignData({ [dataKey]: [] })
      this.setState({
        value: newValue,
        page: 1,
      })
      history.push(newPath)
    }

    handleRemoveFilter = key => e => {
      this.handleQueryParamsChange({ [key]: null })
    }

    handleSearchChange = e => {
      e.preventDefault()
      this.handleQueryParamsChange({ search: e.target.elements.search.value })
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state}
          handleOrderByChange={this.handleOrderByChange}
          handleOrderDirectionChange={this.handleOrderDirectionChange}
          handleRemoveFilter={this.handleRemoveFilter}
          handleSearchChange={this.handleSearchChange}
          goToNextSearchPage={this.goToNextSearchPage}
          handleQueryParamsChange={this.handleQueryParamsChange}
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

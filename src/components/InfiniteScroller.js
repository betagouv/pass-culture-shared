import classnames from 'classnames'
import React, { Component } from 'react'

import Spinner from './Spinner'

const UP = 'up'
const DOWN = 'down'

class InfiniteScroller extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: null,
      isLoading: false,
      isFinished: false,
      lastScrollTop: 0,
    }
  }

  static defaultProps = {
    Tag: 'ul',
    loadScrollRatio: 0.9,
    scrollingElement: document.documentElement,
    renderLoading: () => (
      <Spinner Tag="li" style={{ justifyContent: 'center' }} />
    ),
    renderFinished: () => (
      <li style={{ justifyContent: 'center' }}>C'est fini !</li>
    ),
    renderErrors: errors => (
      <li className="notification is-danger">{errors.join(' ')}</li>
    ),
  }

  scrollWatch = e => {
    const { isLoading, isFinished } = this.state
    const { handleLoadMore, loadScrollRatio, scrollingElement } = this.props

    const { scrollTop, scrollHeight, clientHeight } = scrollingElement

    const pageScrollRatio = scrollTop / (scrollHeight - clientHeight)
    const scrollDirection = this.state.lastScrollTop > scrollTop ? UP : DOWN
    const shouldLoadMore =
      !isFinished &&
      !isLoading &&
      scrollDirection === DOWN &&
      pageScrollRatio > loadScrollRatio

    this.setState({
      isLoading: isLoading || shouldLoadMore,
      lastScrollTop: scrollTop,
    })

    shouldLoadMore && handleLoadMore(this.loadSuccess, this.loadError)
  }

  loadSuccess = (state, action) => {
    this.setState({
      isLoading: false,
      isFinished: action.data.length === 0, //TODO consider action.data.length < perPage
    })
  }

  loadError = (state, action) => {
    this.setState({
      isLoading: false,
      errors: action.errors,
    })
  }

  componentDidMount() {
    window.addEventListener('scroll', this.scrollWatch)
    this.setState({
      lastScrollTop: this.props.scrollingElement.scrollTop,
    })
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollWatch)
  }

  render() {
    const {
      children,
      className,
      renderErrors,
      renderLoading,
      renderFinished,
      Tag,
    } = this.props
    const { errors, isFinished, isLoading } = this.state
    return (
      <Tag className={classnames('infinite-scroller', className)}>
        {children}
        {isLoading && renderLoading()}
        {isFinished && renderFinished()}
        {errors && renderErrors(errors)}
      </Tag>
    )
  }
}

export default InfiniteScroller

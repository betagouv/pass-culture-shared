import get from 'lodash.get'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Spinner from './Spinner'

const UP = 'up'
const DOWN = 'down'

export class InfiniteScroller extends Component {
  constructor(props) {
    super(props)
    this.state = {
      errors: null,
      isFinished: false,
      isLoading: false,
      lastScrollTop: 0,
    }
  }

  componentDidMount() {
    const { listeningScrollElement, scrollingElement } = this.props
    if (!listeningScrollElement) {
      window.addEventListener('scroll', this.scrollWatch)
    } else {
      listeningScrollElement.addEventListener('scroll', this.scrollWatch)
    }
    this.setState({
      lastScrollTop: scrollingElement.scrollTop,
    })
  }

  componentWillUnmount() {
    const { listeningScrollElement } = this.props
    if (!listeningScrollElement) {
      window.addEventListener('scroll', this.scrollWatch)
    } else {
      listeningScrollElement.removeEventListener('scroll', this.scrollWatch)
    }
  }

  scrollWatch = () => {
    const { isLoading, isFinished, lastScrollTop } = this.state
    const { handleLoadMore, loadScrollRatio, scrollingElement } = this.props
    const { scrollTop, scrollHeight, clientHeight } = scrollingElement

    const pageScrollRatio = scrollTop / (scrollHeight - clientHeight)
    const scrollDirection = lastScrollTop > scrollTop ? UP : DOWN

    const shouldLoadMore =
      !isFinished &&
      !isLoading &&
      scrollDirection === DOWN &&
      pageScrollRatio > loadScrollRatio

    this.setState({
      isLoading: isLoading || shouldLoadMore,
      lastScrollTop: scrollTop,
    })

    if (shouldLoadMore) {
      handleLoadMore(this.loadSuccess, this.loadError)
    }
  }

  loadSuccess = (state, action) => {
    const { data } = action
    this.setState({
      isFinished: data.length === 0, // TODO consider action.data.length < perPage
      isLoading: false,
    })
  }

  loadError = (state, action) => {
    this.setState({
      errors: action.errors,
      isLoading: false,
    })
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

InfiniteScroller.defaultProps = {
  Tag: 'ul',
  className: null,
  handleLoadMore: null,
  listeningScrollElement: null,
  loadScrollRatio: 0.9,
  renderErrors: errors => (
    <li className="notification is-danger">
      {get(errors, 'global') && get(errors, 'global').join(' ')}
    </li>
  ),
  renderFinished: () => <li style={{ justifyContent: 'center' }} />,
  renderLoading: () => (
    <Spinner Tag="li" style={{ justifyContent: 'center' }} />
  ),
  scrollingElement: document.documentElement,
}

InfiniteScroller.propTypes = {
  Tag: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  handleLoadMore: PropTypes.func,
  listeningScrollElement: PropTypes.instanceOf(Element),
  loadScrollRatio: PropTypes.number,
  renderErrors: PropTypes.func,
  renderFinished: PropTypes.func,
  renderLoading: PropTypes.func,
  scrollingElement: PropTypes.instanceOf(Element),
}

export default InfiniteScroller

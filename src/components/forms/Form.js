import get from 'lodash.get'
import set from 'lodash.set'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { requestData } from 'redux-saga-data'

import { blockersByName } from '../hocs/withBlock'
import { removeErrors } from '../../reducers/errors'
import { mergeForm } from '../../reducers/form'
import { showModal } from '../../reducers/modal'
import {
  closeNotification,
  showNotification,
} from '../../reducers/notification'
import { recursiveMap } from '../../utils/react'
import { pluralize } from '../../utils/string'

const defaultFormatPatch = patch => patch

class _Form extends Component {

  static inputsByType = {}

  constructor(props) {
    super(props)
    this.state = {
      hasAtLeastOneTargetValue: false,
      isEditing: false,
      isLoading: false,
      method: null,
    }
  }

  static getDerivedStateFromProps = props => {
    const isEditing = typeof get(props, 'patch.id') !== 'undefined'
    return {
      isEditing,
      method: props.method || (isEditing ? 'PATCH' : 'POST'),
    }
  }

  componentDidMount() {
    this.handleHistoryBlock()
    this.initKeyListeners()
  }

  componentDidUpdate(prevProps, prevState) {
    const { isAutoSubmit, location, readOnly } = this.props
    const { hasAtLeastOneTargetValue } = this.state

    if (prevProps.readOnly !== readOnly) {
      this.handleHistoryBlock()
    }
    if (prevProps.location.key !== location.key) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ hasAtLeastOneTargetValue: false })
    }

    if (
      isAutoSubmit &&
      hasAtLeastOneTargetValue &&
      !prevState.hasAtLeastOneTargetValue
    ) {
      this.onSubmit()
    }
  }

  componentWillUnmount() {
    const { BlockComponent } = this.props
    if (BlockComponent && blockersByName.form) {
      delete blockersByName.form
    }
  }

  onMergeForm = (patch, config) => {
    const {
      dispatch,
      formPatch,
      name,
      notification,
      patch: basePatch,
    } = this.props
    const { hasAtLeastOneTargetValue } = this.state

    if (!hasAtLeastOneTargetValue && get(config, 'event.target')) {
      this.setState({ hasAtLeastOneTargetValue: true })
    }

    // no need to go further if patch is actually equal to formPatch
    const mergePatch = Object.assign({}, patch)
    Object.keys(mergePatch).forEach(key => {
      if (formPatch[key] === mergePatch[key]) {
        delete mergePatch[key]
      } else if (mergePatch[key] === ' ' && !get(basePatch, key)) {
        mergePatch[key] = ''
      }
    })

    if (Object.keys(mergePatch).length === 0) {
      return
    }

    if (
      get(notification, 'name') === name &&
      (get(notification, 'type') === 'danger' ||
        get(notification, 'type') === 'success')
    ) {
      dispatch(closeNotification())
    }
    dispatch(removeErrors(name))

    dispatch(mergeForm(name, mergePatch, config))
  }

  initKeyListeners = () => {
    if (this.props.onEnterKey !== null || this.props.onEscapeKey !== null) {
      this.domNode.onkeyup = originalEvent => {
        const customEvent = {
          originalEvent,
          form: this,
          DOMNode: this.domNode
        }

        if (this.props.onEnterKey !== null && originalEvent.key === 'Enter') {
          this.props.onEnterKey(customEvent);
        }

        if (this.props.onEscapeKey !== null && originalEvent.key === 'Escape') {
          this.props.onEscapeKey(customEvent);
        }
      }
    }
  }

  onSubmit = event => {
    if (event) {
      event.preventDefault()
    }
    const {
      action,
      dispatch,
      formPatch,
      formatPatch,
      name,
      normalizer,
      storePath,
    } = this.props
    const { method } = this.state

    this.setState({
      hasAtLeastOneTargetValue: false,
      isLoading: true,
    })

    const body = formatPatch(formPatch)

    const apiPath = action.replace(/^\//g, '')

    dispatch(requestData({
      apiPath,
      body,
      handleFail: this.handleFail,
      handleSuccess: this.handleSuccess,
      method,
      name,
      normalizer,
      stateKey: storePath, // key is a reserved prop name
    }))
  }

  handleFail = (state, action) => {
    const {
      dispatch,
      handleFailNotification,
      handleFailRedirect,
      handleFail,
      history,
      name,
    } = this.props

    this.setState({ isLoading: false })

    if (handleFail) {
      handleFail(state, action)
      return
    }

    if (handleFailNotification) {
      dispatch(showNotification({
        name,
        text: handleFailNotification(state, action),
        type: 'danger',
      }))
    }

    if (handleFailRedirect) {
      history.push(handleFailRedirect(state, action))
    }
  }

  handleSuccess = (state, action) => {
    const {
      dispatch,
      handleSuccessNotification,
      handleSuccessRedirect,
      handleSuccess,
      history,
      name,
    } = this.props

    this.setState({ isLoading: false })

    if (handleSuccess) {
      handleSuccess(state, action)
      return
    }

    if (handleSuccessNotification) {
      dispatch(showNotification({
        name,
        text: handleSuccessNotification(state, action),
        type: 'success',
      }))
    }

    if (handleSuccessRedirect) {
      history.push(handleSuccessRedirect(state, action))
    }
  }

  childrenWithProps = () => {
    const {
      Tag,
      children,
      formPatch,
      errorsPatch,
      history,
      layout,
      name,
      onSubmit,
      patch: basePatch,
      readOnly,
      size,
    } = this.props
    const { isEditing, isLoading } = this.state

    let requiredFields = []

    return recursiveMap(children, c => {
      if (c.type.displayName === 'Field') {
        const patchKey = c.props.patchKey || c.props.name // name is unique, patchKey may not
        const getKey = c.props.setKey
          ? `${c.props.setKey}.${patchKey}`
          : patchKey
        const formValue = get(formPatch, getKey)
        const baseValue = get(basePatch, getKey)
        const type = c.props.type || 'text'
        // eslint-disable-next-line no-use-before-define
        const InputComponent = Form.inputsByType[type]
        if (!InputComponent)
          console.error('Component not found for type:', type)

        const onChange = (value, config) => {
          let newPatch

          const valuePatch = { [patchKey]: value }

          const mergeConfig = Object.assign({}, config)

          // SPECIAL SET WITH SLUG KEY
          if (c.props.setKey) {
            mergeConfig.isMergingObject = true
            newPatch = {}
            set(newPatch, c.props.setKey, valuePatch)
          } else {
            newPatch = valuePatch
          }

          this.onMergeForm(newPatch, mergeConfig)
        }

        let value = ''
        if (typeof formValue !== 'undefined') {
          value = formValue
        } else if (typeof baseValue !== 'undefined') {
          value = baseValue
        }

        const id = `${name}-${c.props.name}`

        const newChild = React.cloneElement(c, {
          InputComponent,
          errors: get(errorsPatch, c.props.name),
          formName: name,
          id,
          layout,
          onChange,
          onMergeForm: this.onMergeForm,
          patchKey,
          readOnly: c.props.readOnly || readOnly,
          size,
          type,
          value,
        })

        if (newChild.props.required) {
          requiredFields = requiredFields.concat(newChild)
        }

        return newChild
      }
      if (c.type.displayName === 'SubmitButton') {
        return React.cloneElement(
          c,
          Object.assign(
            {
              getDisabled: () => {
                if (isEditing) {
                  return false
                }

                const disablingFields = requiredFields.filter(f => {
                  if (f.props.disabling && f.props.disabling()) {
                    return true
                  }
                  return false
                })

                if (disablingFields.length > 0) {
                  return true
                }

                const missingFields = requiredFields.filter(
                  f => !get(formPatch, f.props.patchKey)
                )

                return missingFields.length > 0
              },
              getTitle: () => {
                const missingFields = requiredFields.filter(
                  f => !get(formPatch, f.props.patchKey)
                )

                if (missingFields.length === 0) return null

                const missingText = missingFields
                  .map(f =>
                    (typeof (f.props.label || f.props.title) !== 'string'
                      ? f.props.name
                      : f.props.label || f.props.title || ''
                    ).toLowerCase()
                  )
                  .join(', ')

                return `Champs ${pluralize(
                  'non-valide',
                  missingFields.length
                )}&nbsp;:&nbsp;${missingText}`
              },
              isLoading,
              name,
            },
            Tag !== 'form' || !onSubmit
              ? {
                  // If not a real form, need to mimic the submit behavior
                  onClick: this.onSubmit,
                  type: 'button',
                }
              : {}
          )
        )
      }
      if (c.type.displayName === 'CancelButton') {
        return React.cloneElement(c, {
          onClick: () => {
            const { to } = c.props
            if (to) {
              history.push(to)
            }
            this.resetPatch()
          },
          type: 'button',
        })
      }
      return c
    })
  }

  resetPatch = () => {
    const {
      dispatch,
      name,
      notification,
      patch,
    } = this.props

    if (
      get(notification, 'name') === name &&
      (get(notification, 'type') === 'danger' ||
        get(notification, 'type') === 'success')
    ) {
      dispatch(closeNotification())
    }
    dispatch(removeErrors(name))
    dispatch(mergeForm(name, patch))
  }

  handleHistoryBlock() {
    const { BlockComponent } = this.props

    if (BlockComponent) {
      blockersByName.form = (nextLocation, unblock) => {
        const { dispatch, readOnly } = this.props
        const { hasAtLeastOneTargetValue } = this.state

        // NO NEED TO BLOCK IF THE FORM IS READONLY OR WITH NO INTERACTION FROM USER
        if (readOnly || !hasAtLeastOneTargetValue) {
          return false
        }

        dispatch(showModal(
          <BlockComponent nextLocation={nextLocation} unblock={unblock} />,
          { isUnclosable: true }
        ))

        return true
      }
    }
  }

  render() {
    const { action, className, name, Tag } = this.props
    const { method } = this.state
    if (!Tag) {
      return this.childrenWithProps()
    }

    return (
      <Tag
        action={action}
        className={className}
        id={name}
        method={method}
        onSubmit={this.onSubmit}
        ref={node => this.domNode = node}
      >
        {this.childrenWithProps()}
      </Tag>
    )
  }
}

_Form.defaultProps = {
  BlockComponent: null,
  Tag: 'form',
  className: null,
  errorsPatch: {},
  failNotification: 'Formulaire non validé',
  formPatch: {},
  formatPatch: defaultFormatPatch,
  handleFail: null,
  handleFailNotification: null,
  handleFailRedirect: null,
  handleSuccess: null,
  handleSuccessNotification: null,
  handleSuccessRedirect: null,
  normalizer: null,
  onEnterKey: null,
  onEscapeKey: null,
  onSubmit: null,
  successNotification: 'Formulaire non validé',
}

_Form.propTypes = {
  Tag: PropTypes.string,
  action: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  dispatch: PropTypes.func,
  errorsPatch: PropTypes.object,
  formPatch: PropTypes.object,
  formatPatch: PropTypes.func,
  handleFail: PropTypes.func,
  handleFailNotification: PropTypes.func,
  handleFailRedirect: PropTypes.func,
  handleSuccess: PropTypes.func,
  handleSuccessNotification: PropTypes.func,
  handleSuccessRedirect: PropTypes.func,
  history: PropTypes.object,
  isAutoSubmit: PropTypes.bool,
  layout: PropTypes.string,
  location: PropTypes.object,
  name: PropTypes.string.isRequired,
  normalizer: PropTypes.object,
  onEnterKey: PropTypes.func,
  onEscapeKey: PropTypes.func,
  onSubmit: PropTypes.func,
  patch: PropTypes.object,
}

function mapStateToProps (state, ownProps) {
  const { name } = ownProps
  return {
    errorsPatch: get(state, `errors.${name}`),
    formPatch: get(state, `form.${name}`),
    notification: state.notification,
  }
}

const Form = compose(
  withRouter,
  connect(mapStateToProps)
)(_Form)


// WE NEED TO SHORT PASS THEM BECAUSE OF
// compose withRouter, connect
Form.defaultProps = _Form.defaultProps
Form.inputsByType = _Form.inputsByType
Form.propTypes = _Form.propTypes

export default Form

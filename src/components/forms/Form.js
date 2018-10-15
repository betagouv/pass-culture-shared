import get from 'lodash.get'
import set from 'lodash.set'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import { blockersByName } from '../hocs/withBlock'
import { requestData } from '../../reducers/data'
import { removeErrors } from '../../reducers/errors'
import { mergeForm } from '../../reducers/form'
import { closeModal, showModal } from '../../reducers/modal'
import { closeNotification, showNotification } from '../../reducers/notification'
import { recursiveMap } from '../../utils/react'
import { pluralize } from '../../utils/string'

class _Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasAtLeastOneTargetValue: false,
      isEditing: false,
      isFormData: true,
      isLoading: false,
      method: null,
    }
  }

  static defaultProps = {
    errorsPatch: {},
    failNotification: "Formulaire non validé",
    formatPatch: data => data,
    formPatch: {},
    successNotification: "Formulaire non validé",
    Tag: 'form',
  }

  static propTypes = {
    name: PropTypes.string.isRequired,
    action: PropTypes.string.isRequired,
    patch: PropTypes.object,
  }

  static inputsByType = {}

  static getDerivedStateFromProps = (props, prevState) => {
    const isEditing = typeof get(props, 'patch.id') !== 'undefined'
    return {
      isEditing,
      method: props.method || (isEditing ? 'PATCH' : 'POST'),
    }
  }

  onMergeForm = (patch, config) => {
    const {
      closeNotification,
      formPatch,
      mergeForm,
      name,
      notification,
      patch: basePatch,
      removeErrors,
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
      get(notification, 'name') === name && (
        get(notification, 'type') === 'danger' ||
        get(notification, 'type') === 'success'
      )
    ) {
      closeNotification()
    }
    removeErrors(name)
    mergeForm(name, mergePatch, config)
  }

  onSubmit = e => {
    e && e.preventDefault()
    const {
      action,
      formPatch,
      formatPatch,
      name,
      requestData,
      storePath,
    } = this.props
    const { isFormData } = this.state

    this.setState({
      hasAtLeastOneTargetValue: false,
      isLoading: true
    })


    let body = formatPatch(formPatch)
    if (isFormData) {
      const bodyFormData = new FormData()
      Object.keys(body).forEach(key => bodyFormData[key] = body[key])
      body = bodyFormData
    }

    requestData(this.state.method, action.replace(/^\//g, ''), {
      body,
      encode: body instanceof FormData
        ? 'multipart/form-data'
        : null,
      handleFail: this.handleFail,
      handleSuccess: this.handleSuccess,
      key: storePath, // key is a reserved prop name
      name,
    })
  }

  handleFail = (state, action) => {
    const {
      handleFailNotification,
      handleFailRedirect,
      handleFail,
      history,
      name,
      showNotification,
    } = this.props

    this.setState({ isLoading: false })

    if (handleFail) {
      handleFail(state, action)
      return
    }

    handleFailNotification &&
      showNotification({
        name,
        text: handleFailNotification(state, action),
        type: 'danger',
      })

    handleFailRedirect &&
      history.push(handleFailRedirect(state, action))
  }

  handleSuccess = (state, action) => {
    const {
      handleSuccessNotification,
      handleSuccessRedirect,
      handleSuccess,
      history,
      name,
      showNotification,
    } = this.props

    this.setState({ isLoading: false })

    if (handleSuccess) {
      handleSuccess(state, action)
      return
    }

    handleSuccessNotification &&
      showNotification({
        name,
        text: handleSuccessNotification(state, action),
        type: 'success',
      })

    handleSuccessRedirect &&
      history.push(handleSuccessRedirect(state, action))
  }

  childrenWithProps = () => {
    const {
      children,
      formPatch,
      errorsPatch,
      history,
      layout,
      name,
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
        const InputComponent = Form.inputsByType[type]
        if (!InputComponent)
          console.error('Component not found for type:', type)

        if (type === "file") {
          this.setState({ isFormData: true })
        }

        const onChange = (value, config) => {

          let newPatch

          const setValue = typeof value === 'object'
            ? value
            : { [patchKey]: value }

          if (c.props.setKey) {
            newPatch = {}
            set(newPatch, c.props.setKey, setValue)
          } else {
            newPatch = setValue
          }

          this.onMergeForm(newPatch, config)
        }

        const value =
          typeof formValue !== 'undefined'
            ? formValue
            : typeof baseValue !== 'undefined'
              ? baseValue
              : ''

        const id = `${name}-${c.props.name}`

        const newChild = React.cloneElement(
          c,
          {
            errors: get(errorsPatch, c.props.name),
            id,
            formName: name,
            InputComponent,
            layout,
            onChange,
            patchKey,
            readOnly: c.props.readOnly || readOnly,
            size,
            type,
            value,
          }
        )

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
              isLoading,
              name,
              getDisabled: () => {
                if (isEditing) {
                  return false
                }

                const disablingFields = requiredFields.filter(
                  f => {
                    if (f.props.disabling && f.props.disabling()) {
                      return true
                    }
                    return false
                  }
                )

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

                if (missingFields.length === 0) return

                const missingText = missingFields.map(f =>
                  (typeof (f.props.label || f.props.title) !== 'string'
                    ? f.props.name
                    : f.props.label || f.props.title || '').toLowerCase())
                                                 .join(', ')

                return `Champs ${pluralize('non-valide', missingFields.length)}&nbsp;:&nbsp;${
                  missingText}`
              },
            },
            this.props.Tag !== 'form' || !this.props.onSubmit
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
            to && history.push(to)
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
      closeNotification,
      name,
      mergeForm,
      notification,
      patch,
      removeErrors,
    } = this.props

    if (
      get(notification, 'name') === name && (
        get(notification, 'type') === 'danger' ||
        get(notification, 'type') === 'success'
      )
    ) {
      closeNotification()
    }
    removeErrors(name)
    mergeForm(name, patch)
  }

  handleHistoryBlock () {
    const {
      BlockComponent
    } = this.props

    if (BlockComponent) {
      blockersByName.form = (nextLocation, unblock) => {
        const {
          readOnly,
          showModal
        } = this.props
        const {
          hasAtLeastOneTargetValue
        } = this.state

        // NO NEED TO BLOCK IF THE FORM IS READONLY OR WITH NO INTERACTION FROM USER
        if (readOnly || !hasAtLeastOneTargetValue) {
          return false
        }

        showModal(<BlockComponent
          nextLocation={nextLocation}
          unblock={unblock} />, { isUnclosable: true })

        return true
      }
    }
  }

  componentDidMount() {
    this.handleHistoryBlock()
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      isAutoSubmit,
      location,
      readOnly
    } = this.props
    const {
      hasAtLeastOneTargetValue
    } = this.state

    if (prevProps.readOnly !== readOnly) {
      this.handleHistoryBlock()
    }
    if (prevProps.location.key !== location.key) {
      this.setState({ hasAtLeastOneTargetValue: false })
    }

    if (
      isAutoSubmit &&
      hasAtLeastOneTargetValue && !prevState.hasAtLeastOneTargetValue
    ) {
      this.onSubmit()
    }

  }

  componentWillUnmount () {
    const { BlockComponent } = this.props
    BlockComponent && blockersByName.form && delete blockersByName.form
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
        onSubmit={this.onSubmit}>
        {this.childrenWithProps()}
      </Tag>
    )
  }
}

const Form = compose(
  withRouter,
  connect(
    (state, ownProps) => ({
      formPatch: get(state, `form.${ownProps.name}`),
      notification: state.notification,
      errorsPatch: get(state, `errors.${ownProps.name}`),
    }),
    {
      closeModal,
      closeNotification,
      mergeForm,
      removeErrors,
      requestData,
      showModal,
      showNotification,
    }
  )
)(_Form)

// WE NEED TO SHORT PASS THEM BECAUSE OF
// THE compose withRouter, connect
Form.defaultProps = _Form.defaultProps
Form.inputsByType = _Form.inputsByType


export default Form

import get from 'lodash.get'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

import { requestData } from '../../reducers/data'
import { removeErrors } from '../../reducers/errors'
import { mergeForm } from '../../reducers/form'
import {
  closeNotification,
  showNotification,
} from '../../reducers/notification'
import { recursiveMap } from '../../utils/react'
import { pluralize } from '../../utils/string'

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEditing: false,
      isLoading: false,
      method: null,
    }
  }

  static defaultProps = {
    errorsPatch: {},
    failNotification: 'Formulaire non validé',
    formatPatch: data => data,
    formPatch: {},
    successNotification: 'Formulaire non validé',
    TagName: 'form',
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
      get(notification, 'type') === 'danger' ||
      get(notification, 'type') === 'success'
    ) {
      closeNotification()
    }
    removeErrors(name)
    mergeForm(name, mergePatch, config)
  }

  onSubmit = e => {
    e.preventDefault()
    const {
      action,
      formPatch,
      formatPatch,
      handleSuccess,
      name,
      requestData,
      storePath,
    } = this.props

    this.setState({ isLoading: true })

    requestData(this.state.method, action.replace(/^\//g, ''), {
      body: formatPatch(formPatch),
      encode: formPatch instanceof FormData ? 'multipart/form-data' : null,
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
      showNotification,
    } = this.props

    this.setState({ isLoading: false })

    if (handleFail) {
      handleFail(state, action)
      return
    }

    handleFailNotification &&
      showNotification({
        text: handleFailNotification(state, action),
        type: 'danger',
      })

    handleFailRedirect && history.push(handleFailRedirect(state, action))
  }

  handleSuccess = (state, action) => {
    const {
      handleSuccessNotification,
      handleSuccessRedirect,
      handleSuccess,
      location,
      history,
      patch,
      showNotification,
    } = this.props

    this.setState({ isLoading: false })

    if (handleSuccess) {
      handleSuccess(state, action)
      return
    }

    handleSuccessNotification &&
      showNotification({
        text: handleSuccessNotification(state, action),
        type: 'success',
      })

    if (handleSuccessRedirect) {
      history.push(handleSuccessRedirect(state, action))
    }
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
        const formValue = get(formPatch, patchKey)
        const baseValue = get(basePatch, patchKey)
        const type = c.props.type || 'text'
        const InputComponent = Form.inputsByType[type]
        if (!InputComponent)
          console.error('Component not found for type:', type)

        const onChange = (value, config) => {
          const newPatch =
            typeof value === 'object' ? value : { [patchKey]: value }
          this.onMergeForm(newPatch, config)
        }

        const value =
          typeof formValue !== 'undefined'
            ? formValue
            : typeof baseValue !== 'undefined'
              ? baseValue
              : ''

        const newChild = React.cloneElement(
          c,
          Object.assign({
            errors: []
              .concat(errorsPatch)
              .filter(e => get(e, c.props.name))
              .map(e => get(e, c.props.name)),
            id: `${name}-${c.props.name}`,
            InputComponent,
            layout,
            onChange,
            patchKey,
            readOnly: c.props.readOnly || readOnly,
            size,
            type,
            value,
          })
        )

        if (newChild.props.required) {
          requiredFields = requiredFields.concat(newChild)
        }

        return newChild
      } else if (c.type.displayName === 'SubmitButton') {
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

                const missingFields = requiredFields.filter(
                  f => !get(formPatch, f.props.patchKey)
                )

                console.log(
                  'missingFields',
                  missingFields,
                  'requiredFields',
                  requiredFields
                )
                return missingFields.length > 0
              },
              getTitle: () => {
                const missingFields = requiredFields.filter(
                  f => !get(formPatch, f.props.patchKey)
                )
                if (missingFields.length === 0) return
                return `Champs ${pluralize(
                  'non-valide',
                  missingFields.length
                )} : ${missingFields
                  .map(f =>
                    (f.props.label || f.props.title || '').toLowerCase()
                  )
                  .join(', ')}`
              },
            },
            this.props.TagName !== 'form'
              ? {
                  // If not a real form, need to mimic the submit behavior
                  onClick: this.onSubmit,
                  type: 'button',
                }
              : {}
          )
        )
      } else if (c.type.displayName === 'CancelButton') {
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
      get(notification, 'type') === 'danger' ||
      get(notification, 'type') === 'success'
    ) {
      closeNotification()
    }
    removeErrors(name)
    mergeForm(name, patch)
  }

  render() {
    const { action, className, name, TagName } = this.props
    const { method } = this.state
    if (!TagName) {
      return this.childrenWithProps()
    }

    return (
      <TagName
        action={action}
        className={className}
        id={name}
        method={method}
        onSubmit={this.onSubmit}>
        {this.childrenWithProps()}
      </TagName>
    )
  }
}

export default compose(
  withRouter,
  connect(
    (state, ownProps) => ({
      formPatch: get(state, `form.${ownProps.name}`),
      notification: state.notification,
      errorsPatch: get(state, `errors.${ownProps.name}`),
    }),
    {
      closeNotification,
      mergeForm,
      removeErrors,
      requestData,
      showNotification,
    }
  )
)(Form)

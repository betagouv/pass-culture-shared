import React, { Fragment, PureComponent } from 'react'

class FileInput extends PureComponent {
  constructor () {
    super()
    this.state = {
      fileName: null
    }
  }

  onChange = event => {
    event.persist()
    console.log('event', event.target.value)
    const fileName = event.target.value.replace("C:\\fakepath\\", "")
    this.setState({ fileName })
    this.props.onChange(this.$uploadInput.files[0], { event })
  }

  render() {
    const { readOnly, uploaded } = this.props
    const { fileName } = this.state

    if (readOnly) {
      return (
        <input className="input" readOnly value={uploaded
        ? "[enregistré]"
        : "[pas enregistré]"}/>
      )
    }

    return (
      <Fragment>
        <label className="button is-primary is-outlined mr12">
          Choisir un fichier{' '}
          <input
            hidden
            onChange={this.onChange}
            ref={$element => (this.$uploadInput = $element)}
            type="file"
          />
        </label>
        <span>
          {fileName}
        </span>
      </Fragment>
    )
  }
}

export default FileInput

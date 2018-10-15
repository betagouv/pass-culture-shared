import React, { PureComponent } from 'react'

class FileInput extends PureComponent {
  onChange = event => {
    event.persist()
    this.props.onChange(this.$uploadInput.files[0], { event })
  }

  render() {
    return (
      <label className="button is-primary is-outlined">
        Choisir un fichier{' '}
        <input
          hidden
          onChange={this.onChange}
          ref={$element => (this.$uploadInput = $element)}
          type="file"
        />
      </label>
    )
  }
}

export default FileInput

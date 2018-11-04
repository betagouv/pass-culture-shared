import get from 'lodash.get'
import { put, takeEvery } from 'redux-saga/effects'

import { mergeErrors } from '../reducers/errors'

export function* fromWatchFailDataActionsMergeErrors(action) {
  const name = get(action, 'config.name') || action.path
  let patch = action.errors
  if (Array.isArray(action.errors)) {
    patch = {}
    action.errors.forEach(error => Object.assign(patch, error))
  }
  yield put(mergeErrors(name, patch, action.config))
}

export function* watchErrorsActions() {
  yield takeEvery(
    ({ type }) => /FAIL_DATA_(.*)/.test(type),
    fromWatchFailDataActionsMergeErrors
  )
}

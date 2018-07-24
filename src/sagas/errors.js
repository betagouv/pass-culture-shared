import get from 'lodash.get'
import { put, takeEvery } from 'redux-saga/effects'

import { mergeErrors } from '../reducers/errors'

function* fromWatchFailDataActions(action) {
  const name = get(action, 'config.name') || action.path
  yield put(mergeErrors(name, action.errors, action.config))
}

export function* watchErrorsActions() {
  yield takeEvery(
    ({ type }) => /FAIL_DATA_(.*)/.test(type),
    fromWatchFailDataActions
  )
}

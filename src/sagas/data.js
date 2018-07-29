import { call, put, select, takeEvery } from 'redux-saga/effects'

import { failData, successData } from '../reducers/data'
import { fetchData } from '../utils/request'

function* fromWatchRequestDataActions(action) {
  // UNPACK
  const { method, path, config } = action
  const { body, encode, type } = config || {}

  // DATA
  try {
    // CALL
    const result = yield call(fetchData, method, path, { body, encode })

    // SUCCESS OR FAIL
    if (result.data) {
      yield put(successData(method, path, result.data, config))
    } else {
      console.error(result.errors)
      yield put(failData(method, path, result.errors, config))
    }
  } catch (error) {
    yield put(
      failData(
        method,
        path,
        [
          {
            global: 'Erreur serveur. Tentez de rafraîchir la page.',
          },
        ],
        config
      )
    )
  }
}

function* fromWatchFailDataActions(action) {
  if (action.config.handleFail) {
    const state = yield select(state => state)
    yield call(action.config.handleFail, state, action)
  }
}

function* fromWatchSuccessDataActions(action) {
  if (action.config.handleSuccess) {
    const state = yield select(state => state)
    yield call(action.config.handleSuccess, state, action)
  }
}

export function* watchDataActions() {
  yield takeEvery(
    ({ type }) => /REQUEST_DATA_(.*)/.test(type),
    fromWatchRequestDataActions
  )
  yield takeEvery(
    ({ type }) => /FAIL_DATA_(.*)/.test(type),
    fromWatchFailDataActions
  )
  yield takeEvery(
    ({ type }) => /SUCCESS_DATA_(.*)/.test(type),
    fromWatchSuccessDataActions
  )
}

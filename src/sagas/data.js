import { call, put, select, takeEvery } from 'redux-saga/effects'

import { failData, successData } from '../reducers/data'
import { fetchData } from '../utils/request'

const fromWatchRequestDataActions = (extraConfig={}) =>
  function* (action) {
    // UNPACK
    const { method, path, config } = action
    const { body, encode, url } = Object.assign(extraConfig, config || {})

    // DATA
    try {
      // CALL
      const result = yield call(fetchData, method, path, { body, encode, url })

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

export function* watchDataActions(config = {}) {
  yield takeEvery(
    ({ type }) => /REQUEST_DATA_(.*)/.test(type),
    fromWatchRequestDataActions(config)
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

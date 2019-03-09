import get from 'lodash.get'
import { put, select, takeEvery } from 'redux-saga/effects'
import { resetData } from 'redux-saga-data'

import { setUser } from '../reducers/user'

export function* fromWatchRequestSignActions() {
  yield put(setUser(false)) // false while querying
}

export function* fromWatchFailSignActions() {
  yield put(setUser(null)) // null otherwise
}

export function* fromWatchSuccessGetSignoutActions() {
  yield put(resetData())
  yield put(setUser(null))
}

export function* fromWatchSuccessSignActions(action) {
  const { payload } = action
  const successUser = payload.datum
  const currentUser = yield select(state => state.user)
  if (successUser && !currentUser) {
    yield put(setUser(successUser))
  } else if (!successUser) {
    yield put(setUser(false))
  }
}

export function* fromWatchSuccessPatchUsers(action) {
  const { payload } = action
  const successUser = payload.datum
  const successUserId = successUser && successUser.id

  const loggedUserId = yield select(state => get(state, 'user.id'))

  if (!loggedUserId) {
    console.warn('You should have a loggedUserId here')
    return
  }

  if (loggedUserId === successUserId) {
    yield put(setUser(successUser))
  }
}

export function* watchUserActions() {
  yield takeEvery(
    ({ type }) =>
      /REQUEST_DATA_POST_\/?USERS\/SIGN(.*)/.test(type) ||
      /REQUEST_DATA_GET_\/?USERS\/CURRENT(.*)/.test(type),
    fromWatchRequestSignActions
  )
  yield takeEvery(
    ({ type }) =>
      /FAIL_DATA_POST_\/?USERS\/SIGN(.*)/.test(type) ||
      /FAIL_DATA_GET_\/?USERS\/CURRENT(.*)/.test(type),
    fromWatchFailSignActions
  )
  yield takeEvery(
    ({ type }) =>
      /SUCCESS_DATA_POST_\/?USERS\/SIGN(.*)/.test(type) ||
      /SUCCESS_DATA_GET_\/?USERS\/CURRENT(.*)/.test(type),
    fromWatchSuccessSignActions
  )
  yield takeEvery(
    ({ type }) => /SUCCESS_DATA_PATCH_\/?USERS/.test(type),
    fromWatchSuccessPatchUsers
  )
  yield takeEvery(
    ({ type }) => /SUCCESS_DATA_GET_\/?USERS\/SIGNOUT(.*)/.test(type),
    fromWatchSuccessGetSignoutActions
  )
}

import createCachedSelector from 're-reselect'
import moment from 'moment'

export default createCachedSelector(
  state => state.tracker,
  (tracker, collectionName) => {
    const trackerKeys = Object.keys(tracker).filter(key =>
      key.startsWith(collectionName)
    )
    const lastTrackerMoment = Math.max(
      ...trackerKeys.map(key => moment(tracker[key]))
    )
    return lastTrackerMoment
  }
)((state, collectionName) => collectionName || '')

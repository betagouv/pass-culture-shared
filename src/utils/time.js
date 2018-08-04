import moment from 'moment'

export function resolveIsNew(datum, data, config) {
  const comparedTo = config.state.tracker[config.path]
  const dateKey = config.dateKey || 'dateCreated'
  if (
    typeof datum === 'object' &&
    datum[dateKey] &&
    moment(datum[dateKey]).isAfter(moment(comparedTo))
  ) {
    console.log('datum', datum)
    return Object.assign({ isNew: true }, datum)
  }
  return datum
}

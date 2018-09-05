import moment from 'moment'

export function resolveIsNew(datum, dateKey, comparedTo) {
  if (
    typeof datum === 'object' &&
    datum[dateKey] &&
    moment(datum[dateKey]).isAfter(moment(comparedTo))
  ) {
    return Object.assign({ isNew: true }, datum)
  }
  return datum
}

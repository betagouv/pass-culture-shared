import { edd_codes_musique, edd_codes } from '../utils/edd'

export const musicTypeParentsSelector = () => {
  return edd_codes_musique.map(item => ({
    code: item.code,
    label: item.label,
  }))
}

export const musicTypeChildrenSelector = (parentCode) => {
  const parentType = edd_codes_musique.filter(item => item.code === parentCode)

  if (parentType.length === 0) {
    return []
  }

  return parentType[0].children
}

export const showTypeParentsSelector = () => {
  return edd_codes.map(item => ({
    code: item.code,
    label: item.label,
  }))
}


export const showTypeChildrenSelector = (parentCode) => {
  const parentType = edd_codes.filter(item => item.code === parentCode)

  if (parentType.length === 0) {
    return []
  }

  return parentType[0].children
}


export default {
  musicTypeParentsSelector,
  musicTypeChildrenSelector,
  showTypeParentsSelector,
  showTypeChildrenSelector,
}

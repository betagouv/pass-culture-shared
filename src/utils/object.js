export function isPlainObject(item) {
  return item &&
    typeof item === 'object' &&
    !Array.isArray(item) &&
    !item instanceof File
}

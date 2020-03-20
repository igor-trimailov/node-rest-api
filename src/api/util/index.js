function isoDateWithOffset(offset = 0) {
  return new Date(Date.now() + offset).toISOString()
}

module.exports = {
  isoDateWithOffset,
}

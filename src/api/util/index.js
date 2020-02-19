function isoDateWithOffset(offset) {
  return new Date(Date.now() + offset).toISOString()
}

module.exports = {
  isoDateWithOffset,
}

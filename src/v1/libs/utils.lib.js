const timestampToIso = (timestamp) =>
  new Date(
    String(timestamp).length === 10 ? timestamp * 1e3 : timestamp
  ).toISOString()

const isoToTimestamp = (isoTime) => {
  parseInt(new Date(isoTime).getTime())
}

const camelCase = (entity) => {
  let newEntity = ''
  for (let k = 0; k < entity.length; k++) {
    if (entity[k] === '_') {
      k++
      newEntity += String(entity[k]).toUpperCase()
      continue
    }
    newEntity += entity[k]
  }
  return newEntity
}

module.exports = { timestampToIso, isoToTimestamp, camelCase }

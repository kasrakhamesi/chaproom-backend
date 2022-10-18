const timestampToIso = (timestamp) => new Date(timestamp).toISOString()

const isoToTimestamp = (isoTime) => parseInt(new Date(isoTime).getTime())

module.exports = { timestampToIso, isoToTimestamp }

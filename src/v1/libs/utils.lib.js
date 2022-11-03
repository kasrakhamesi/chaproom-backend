const timestampToIso = (timestamp) =>
  new Date(
    String(timestamp).length === 10 ? timestamp * 1e3 : timestamp
  ).toISOString()

const isoToTimestamp = (isoTime) => {
  parseInt(new Date(isoTime).getTime())
}

module.exports = { timestampToIso, isoToTimestamp }

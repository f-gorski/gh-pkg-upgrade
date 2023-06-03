const base64ToJSON = (base64) => {
  const buffer = new Buffer.from(base64, "base64")
  const jsonString = buffer.toString("ascii")

  return JSON.parse(jsonString)
}

module.exports = base64ToJSON

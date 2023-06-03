const JSONToBase64 = (json) => {
  const buffer = new Buffer.from(JSON.stringify(json, null, 2))
  return buffer.toString("base64")
}

module.exports = JSONToBase64

const pdfPageCounter = require('pdf-page-counter')
const fs = require('fs')

const pdf = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath)
    const r = await pdfPageCounter(dataBuffer)
    return {
      isSuccess: true,
      data: r.numpages
    }
  } catch (e) {
    return {
      isSuccess: false,
      message: e?.message || "Can't calculate page count"
    }
  }
}

const docx = (filePath) => {}

module.exports = { pdf, docx }

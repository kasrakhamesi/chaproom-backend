const pdfPageCounter = require('pdf-page-counter')
const { DocxCounter } = require('page-count')
const fs = require('fs')

const pdf = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath)
    const r = await pdfPageCounter(dataBuffer)
    return r.numpages
  } catch {
    return 0
  }
}

const docx = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath)
    const r = await DocxCounter.count(dataBuffer)
    return r
  } catch (e) {
    console.log(e)
    return 0
  }
}

module.exports = { pdf, docx }

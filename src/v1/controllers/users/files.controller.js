const { httpError, errorTypes } = require('../../configs')
const { sequelize } = require('../../models')
const { pageCounter } = require('../../libs')
const fs = require('fs')
const path = require('path')

const upload = async (req, res) => {
  try {
    return res.send('are')
    const userId = req?.user[0]?.id

    const { attachment } = req.files

    if (!req.files || Object.keys(req.files).length === 0 || !attachment)
      return httpError(errorTypes.FILE_NOT_SELECTED, res)

    const extensionName = path.extname(attachment.name)

    const allowedExtension = ['.pdf']

    if (!allowedExtension.includes(extensionName.toLowerCase()))
      return httpError(errorTypes.INVALID_PDF_DOCX_FORMAT, res)

    let filePath = `./app/v1/storages/files/${attachment.name}`

    if (fs.existsSync(filePath)) {
      for (let k = 0; k < 100000000000; k++) {
        if (fs.existsSync(`./app/v1/storages/files/${k}${attachment.name}`))
          continue
        filePath = `./app/v1/storages/files/${k}${attachment.name}`
        break
      }
    }

    await attachment.mv(filePath)

    const rCounter = await pageCounter.pdf(filePath)

    const r = await sequelize.models.files.create({
      userId,
      uploadedFileName: attachment.name,
      fileName: attachment.name,
      pageCount: rCounter.data || 0,
      fileUrl: 'are'
    })

    console.log(r)

    res.status(201).send({
      statusCode: 201,
      data: r,
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = { upload }

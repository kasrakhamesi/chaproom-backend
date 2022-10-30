const { httpError, errorTypes, messageTypes } = require('../../configs')
const { sequelize } = require('../../models')
const { pageCounter } = require('../../libs')
const fs = require('fs')
const path = require('path')

const upload = async (req, res) => {
  try {
    const userId = req?.user[0]?.id

    const { attachment } = req.files

    if (!req.files || Object.keys(req.files).length === 0 || !attachment)
      return httpError(errorTypes.FILE_NOT_SELECTED, res)

    const extensionName = path.extname(attachment.name)

    const allowedExtension = ['.pdf']

    if (!allowedExtension.includes(extensionName.toLowerCase()))
      return httpError(errorTypes.INVALID_PDF_DOCX_FORMAT, res)

    let filePath = `./src/v1/storages/files/${attachment.name}`
    let num = 0
    if (fs.existsSync(filePath)) {
      for (let k = 0; k < 100000000000; k++) {
        if (fs.existsSync(`./src/v1/storages/files/${k}${attachment.name}`))
          continue
        num = k
        filePath = `./src/v1/storages/files/${k}${attachment.name}`
        break
      }
    }

    await attachment.mv(filePath)

    const rCounter = await pageCounter.pdf(filePath)

    const r = await sequelize.models.files.create({
      userId,
      uploadedName: num + attachment.name,
      name: num + attachment.name,
      countOfPages: rCounter.data || 0,
      url: 'https://google.com/' + attachment.name
    })

    res.status(201).send({
      statusCode: 201,
      data: {
        message: messageTypes.SUCCESSFUL_CREATED.data.message,
        id: r?.id,
        name: r?.name,
        countOfPages: r?.countOfPages,
        url: r?.url
      },
      error: null
    })
  } catch (e) {
    console.log(e)
    return httpError(e, res)
  }
}

const hardDelete = async (req, res) => {
  const { id } = req.params

  const userId = req?.user[0]?.id
  return sequelize.models.files
    .destroy({
      where: {
        id,
        userId
      }
    })
    .then(() => {
      return res
        .status(messageTypes.SUCCESSFUL_DELETE.statusCode)
        .send(messageTypes.SUCCESSFUL_DELETE)
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

module.exports = { upload, hardDelete }

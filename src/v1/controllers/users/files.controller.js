const { httpError, errorTypes, messageTypes } = require('../../configs')
const { sequelize } = require('../../models')
const { pageCounter } = require('../../libs')
const fs = require('fs')
const path = require('path')

const upload = async (req, res) => {
  try {
    const userId = req?.user[0]?.id

    const { fileName } = req.body

    if (!fileName) return httpError(errorTypes.FILE_NOT_SELECTED, res)

    const { attachment } = req.files

    if (!req.files || Object.keys(req.files).length === 0 || !attachment)
      return httpError(errorTypes.FILE_NOT_SELECTED, res)

    attachment.name = attachment.name === '.pdf' ? '1.pdf' : attachment.name

    attachment.name = attachment.name === '.docx' ? '1.docx' : attachment.name

    attachment.name = attachment.name === '.doc' ? '1.doc' : attachment.name

    attachment.name =
      String(path.extname(attachment.name)).toLowerCase() === '.ocx'
        ? `1${String(attachment.name).replace('d.ocx', '')}.docx`
        : attachment.name

    attachment.name = attachment.name === '.ocx' ? '1.docx' : attachment.name

    const extensionName = path.extname(attachment.name)

    const allowedExtension = ['.pdf', '.docx', '.doc']

    if (!allowedExtension.includes(extensionName.toLowerCase()))
      return httpError(errorTypes.INVALID_PDF_DOCX_FORMAT, res)

    let newFileName = `f${userId}_0${extensionName}`

    let filePath = `./src/v1/storages/files/${userId}/${newFileName}`
    if (fs.existsSync(filePath)) {
      for (let k = 0; k < Number.MAX_VALUE; k++) {
        newFileName = `f${userId}_${k}${extensionName}`

        const endPath = `./src/v1/storages/files/${userId}/${newFileName}`

        if (fs.existsSync(endPath)) continue
        filePath = endPath
        break
      }
    }

    await attachment.mv(filePath)

    let rCounter = 0
    if (String(extensionName).toLowerCase().includes('pdf'))
      rCounter = await pageCounter.pdf(filePath)
    else if (
      String(extensionName).toLowerCase().includes('docx') ||
      String(extensionName).toLowerCase().includes('doc')
    ) {
      rCounter = null //await pageCounter.docx(filePath)
    }

    const r = await sequelize.models.files.create({
      userId,
      uniqueName: newFileName,
      name: fileName,
      countOfPages: rCounter,
      url: '/' + newFileName
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

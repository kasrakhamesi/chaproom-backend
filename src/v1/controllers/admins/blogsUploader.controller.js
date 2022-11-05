const { httpError, errorTypes, messageTypes } = require('../../configs')
const { sequelize } = require('../../models')
const fs = require('fs')
const path = require('path')

const upload = async (req, res) => {
  try {
    console.log('yes')
    const adminId = req?.user[0]?.id

    const { attachment } = req.files

    console.log(attachment)

    if (!req.files || Object.keys(req.files).length === 0 || !attachment)
      return httpError(errorTypes.FILE_NOT_SELECTED, res)

    attachment.name =
      attachment.name[0] === '.' ? `1_${attachment.name}` : attachment.name

    const extensionName = path.extname(attachment.name)

    const allowedExtension = ['.jpg', '.jpeg', '.png']

    if (!allowedExtension.includes(extensionName.toLowerCase()))
      return httpError(errorTypes.INVALID_IMAGE_FORMAT, res)

    let newFileName = `0_${extensionName}`

    let filePath = `./src/v1/storages/blogs-contents/${newFileName}`
    if (fs.existsSync(filePath)) {
      for (let k = 0; k < Number.MAX_VALUE; k++) {
        newFileName = `image_${k}${extensionName}`

        const endPath = `./src/v1/storages/blogs-contents/${newFileName}`

        if (fs.existsSync(endPath)) continue
        filePath = endPath
        break
      }
    }

    await attachment.mv(filePath)

    const r = await sequelize.models.blogs_images.create({
      adminId,
      name: newFileName,
      url: 'https://google.com/' + newFileName
    })

    console.log(r)

    res.status(201).send({
      statusCode: 201,
      data: {
        message: messageTypes.SUCCESSFUL_CREATED.data.message,
        id: r?.id,
        name: r?.name,
        url: r?.url
      },
      error: null
    })
  } catch (e) {
    console.log(e)
    return res.send(e)
    return httpError(e, res)
  }
}

const hardDelete = async (req, res) => {
  const { id } = req.params

  return sequelize.models.blogs_images
    .destroy({
      where: {
        id
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

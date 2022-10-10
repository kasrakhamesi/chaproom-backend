const { sequelize } = require('../../models')

const upload = async (req, res) => {
  try {
    const { attachment } = req.files

    if (!req.files || Object.keys(req.files).length === 0 || !attachment)
      throw new Error('Invalid Inputs')

    const extensionName = path.extname(attachment.name)

    const allowedExtension = ['.pdf', '.docx']

    if (!allowedExtension.includes(extensionName.toLowerCase()))
      throw new Error('Invalid Image Format')

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

    return res.status(201).send({
      statusCode: 201,
      data: {
        icon_url: attachment.name
      },
      error: null
    })
  } catch (e) {
    return res.status(400).send({
      statusCode: 400,
      data: null,
      error: {
        code: null,
        message: e.message
      }
    })
  }
}

module.exports = { upload }

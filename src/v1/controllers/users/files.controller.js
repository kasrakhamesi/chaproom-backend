const { sequelize } = require('../../models')

const upload = async (req, res) => {
  try {
    const { attachment } = req.files

    let { mainWif, amount, name, description, author } = req.body

    if (attachment && mainWif && name && amount && description) {
      if (parseInt(amount) > 30)
        return res.status(400).send({ message: 'maximum amount : 30' })

      const extensionName = path.extname(attachment.name)

      const allowedExtension = ['.png', '.jpg', '.jpeg']

      if (!allowedExtension.includes(extensionName.toLowerCase()))
        return res.status(400).send({ message: 'invalid image format' })

      let filePath = `./app/v1/storages/nfts/${attachment.name}`

      if (fs.existsSync(filePath)) {
        for (let k = 0; k < 100000000000; k++) {
          if (fs.existsSync(`./app/v1/storages/nfts/${k}${attachment.name}`))
            continue
          filePath = `./app/v1/storages/nfts/${k}${attachment.name}`
          break
        }
      }

      amount = parseInt(amount)

      await attachment.mv(filePath)

      const resPinFile = await nft.pinata.pinFiles(
        mainWif,
        amount,
        filePath,
        name,
        description,
        author
      )

      return res.status(resPinFile.status).send(resPinFile.content)
    }

    res.status(400).send({ message: 'invalid inputs' })
  } catch (e) {
    res.status(400).send({ message: e.message })
  }
}

module.exports = { upload }

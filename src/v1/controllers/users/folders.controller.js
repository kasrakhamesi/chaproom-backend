const { httpError } = require('../../configs')
const { sequelize } = require('../../models')

const create = async (req, res) => {
  console.log(req.body)

  const {
    color,
    side,
    size,
    countOfPages,
    uploadedPages,
    binding,
    numberOfCopies,
    description,
    shipmentPrice,
    amount,
    files
  } = req.body

  const userId = req?.user[0]?.id

  const data = {
    color,
    side,
    size,
    countOfPages,
    uploadedPages,
    binding,
    numberOfCopies,
    description,
    shipmentPrice,
    amount,
    userId
  }

  try {
    if (files.length === 0) throw new Error('files not found')

    const findedFiles = await sequelize.models.files.findAll({
      where: {
        userId
      }
    })

    const ids = []
    for (const entity of files) {
      if (findedFiles.findIndex((item) => item.id !== entity.id) === -1)
        ids.push(entity?.id)
    }

    if (ids.length === 0)
      throw new Error('files length should be greater than 0')

    data.summary = 'تست / تست / تست / تست / تست'
    data.countOfFiles = ids.length
    data.filesUrl = 'https://google.com'

    const t = await sequelize.transaction()

    const createdFolders = await sequelize.models.folders.create(data, {
      transaction: t
    })

    for (const entity of ids) {
      await sequelize.models.folder_files.create(
        {
          userId,
          folderId: createdFolders?.id,
          fileId: entity
        },
        { transaction: t }
      )
    }

    await t.commit()

    const r = await sequelize.models.folders.findOne({
      where: {
        userId,
        id: createdFolders?.id
      },
      attributes: {
        exclude: ['userId']
      },
      include: [
        {
          model: sequelize.models.files,
          as: 'files',
          attributes: {
            exclude: ['userId', 'folder_files']
          },
          through: {
            attributes: {
              exclude: [
                'userId',
                'createdAt',
                'updatedAt',
                'fileId',
                'folderId'
              ]
            }
          }
        }
      ]
    })

    return res.status(201).send({
      statusCode: 201,
      data: r,
      error: null
    })
  } catch (e) {
    return httpError(e?.message || String(e), res)
  }
}

const update = (req, res) => {
  const { id } = req.params
  const userId = req?.user[0]?.id

  const {
    color,
    side,
    size,
    countOfPages,
    uploadedPages,
    binding,
    numberOfCopies,
    description,
    shipmentPrice,
    price,
    files
  } = req.body

  const data = {
    color,
    side,
    size,
    countOfPages,
    uploadedPages,
    binding,
    numberOfCopies,
    description,
    shipmentPrice,
    price,
    files
  }
  return sequelize.models.folders
    .update(data, {
      where: {
        userId,
        id
      }
    })
    .then((r) => {
      return res.status(200).send({
        statusCode: 200,
        data: r,
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const findAll = (req, res) => {
  const userId = req?.user[0]?.id
  return sequelize.models.folders
    .findAll({
      where: {
        userId,
        used: false
      },
      attributes: {
        exclude: ['userId']
      },
      include: [
        {
          model: sequelize.models.files,
          attributes: {
            exclude: ['userId', 'folder_files']
          },
          through: {
            attributes: {
              exclude: [
                'userId',
                'createdAt',
                'updatedAt',
                'fileId',
                'folderId'
              ]
            }
          }
        }
      ]
    })
    .then((r) => {
      return res.status(200).send({
        statusCode: 200,
        data: r,
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const findOne = (req, res) => {
  const { id } = req.params
  const userId = req?.user[0]?.id
  return sequelize.models.folders
    .findOne({
      where: {
        userId,
        id,
        used: false
      },
      attributes: {
        exclude: ['userId']
      },
      include: [
        {
          model: sequelize.models.files,
          as: 'files',
          attributes: {
            exclude: ['userId', 'folder_files']
          },
          through: {
            attributes: {
              exclude: [
                'userId',
                'createdAt',
                'updatedAt',
                'fileId',
                'folderId'
              ]
            }
          }
        }
      ]
    })
    .then((r) => {
      return res.staus(200).send({
        statusCode: 200,
        data: r,
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const hardDelete = (req, res) => {
  const { id } = req.params
  const userId = req?.user[0]?.id
  return sequelize.models.folders
    .destroy({
      where: {
        id,
        userId
      }
    })
    .then((r) => {
      return res.staus(200).send({
        statusCode: 200,
        data: r,
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

module.exports = { create, findAll, hardDelete, findOne, update }

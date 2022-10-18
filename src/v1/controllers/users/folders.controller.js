const { httpError } = require('../../configs')
const { sequelize } = require('../../models')

const create = async (req, res) => {
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
    price,
    userId
  }

  try {
    if (files.length === 0) throw new Error('A')

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

    if (ids.length === 0) throw new Error('ASD')

    const createdFolders = await sequelize.models.folders.create(data)

    const folderFiles = []

    for (const entity of ids) {
      folderFiles.push({
        userId,
        folderId: createdFolders?.id,
        fileId: entity
      })
    }

    await sequelize.models.folder_files.bulkCreate(folderFiles)

    return res.status(201).send({
      statusCode: 201,
      data: null,
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
        userId
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
        id
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

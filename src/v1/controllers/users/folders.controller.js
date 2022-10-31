const { httpError, messageTypes, errorTypes } = require('../../configs')
const { sequelize } = require('../../models')
const _ = require('lodash')

const extractBinding = (binding) => {
  if (binding === null) return null

  let { type, method, countOfFiles, coverColor } = binding

  if (!type && !method && !countOfFiles && !coverColor) return null

  if (type !== 'spring_normal' && type !== 'spring_papco' && type !== 'stapler')
    type = null
  if (
    method !== 'each_file_separated' &&
    method !== 'all_files_together' &&
    method !== 'count_of_files'
  )
    method = null
  if (coverColor !== 'black_and_white' && coverColor !== 'colorful')
    coverColor = null
  return JSON.stringify({
    type,
    method,
    countOfFiles: parseInt(countOfFiles) || null,
    coverColor
  })
}

const create = async (req, res) => {
  try {
    const shipmentPrice = 5000
    const amount = 7000
    const {
      color,
      side,
      size,
      countOfPages,
      countOfCopies,
      description,
      binding,
      files
    } = req.body

    const userId = req?.user[0]?.id

    const data = {
      color,
      side,
      size,
      countOfPages,
      uploadedPages: 5,
      countOfCopies,
      description,
      shipmentPrice,
      binding: extractBinding(binding),
      amount,
      userId
    }

    if (files.length === 0) return httpError(errorTypes.MISSING_FILE, res)

    const findedFiles = await sequelize.models.files.findAll({
      where: {
        userId
      }
    })

    const ids = []
    for (const entity of files) {
      if (findedFiles.find((item) => item.id === entity.id))
        ids.push(entity?.id)
    }

    if (ids.length === 0) return httpError(errorTypes.MISSING_FILE, res)

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

    res
      .status(messageTypes.SUCCESSFUL_CREATED.statusCode)
      .send(messageTypes.SUCCESSFUL_CREATED)
  } catch (e) {
    console.log(e)
    return httpError(e?.message || String(e), res)
  }
}

const priceCalculator = async (req, res) => {
  try {
  } catch (e) {
    return httpError(e, res)
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
    countOfCopies,
    description,
    binding,
    files
  } = req.body

  if (files.length === 0) return httpError(errorTypes.MISSING_FILE, res)

  const data = {
    color,
    side,
    size,
    countOfPages,
    uploadedPages: 4,
    binding: extractBinding(binding),
    countOfCopies,
    description
  }

  return sequelize.models.files
    .findAll({
      where: {
        userId
      }
    })
    .then((rFiles) => {
      const filesId = []
      for (const entity of files) {
        if (rFiles.find((item) => item.id === entity.id))
          filesId.push(entity?.id)
      }

      if (filesId.length === 0) return httpError(errorTypes.MISSING_FILE, res)

      return sequelize.models.folders
        .findOne(
          {
            where: {
              userId,
              id
            }
          },
          {
            include: [
              {
                model: sequelize.models.bindings
              },
              {
                model: sequelize.models.files
              }
            ]
          }
        )
        .then((r) => {
          if (!r) return httpError(errorTypes.FOLDER_NOT_FOUND, res)

          r.setFiles(filesId, { through: { userId } })
          r.set(data)

          return sequelize.transaction((t) => {
            return r
              .save({
                transaction: t
              })
              .then((r) => {
                r.save()
              })
          })
        })
        .then(() => {
          return res
            .status(messageTypes.SUCCESSFUL_UPDATE.statusCode)
            .send(messageTypes.SUCCESSFUL_UPDATE)
        })
        .catch((e) => {
          return httpError(e, res)
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
        exclude: ['userId', 'used']
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
        data: r.map((item) => {
          if (item?.binding !== null) {
            item.binding = JSON.parse(item?.binding)
            return item
          }
          return item
        }),
        error: null
      })
    })
    .catch((e) => {
      console.log(e)
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
        exclude: ['userId', 'used']
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
      if (r?.binding !== null) r.binding = JSON.parse(r?.binding)

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

const hardDelete = (req, res) => {
  const { id } = req.params
  const userId = req?.user[0]?.id
  return sequelize.models.folders
    .destroy({
      where: {
        id,
        userId,
        used: false
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

module.exports = {
  create,
  findAll,
  hardDelete,
  findOne,
  update,
  priceCalculator
}

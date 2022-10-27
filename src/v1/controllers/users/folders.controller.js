const { httpError, messageTypes, errorTypes } = require('../../configs')
const { sequelize } = require('../../models')

const create = async (req, res) => {
  try {
    const shipmentPrice = 5000
    const amount = 7000
    const {
      color,
      side,
      size,
      countOfPages,
      uploadedPages,
      numberOfCopies,
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
      uploadedPages,
      numberOfCopies,
      description,
      shipmentPrice,
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
      if (findedFiles.findIndex((item) => item.id !== entity.id) === -1)
        ids.push(entity?.id)
    }

    if (ids.length === 0) return httpError(errorTypes.MISSING_FILE, res)

    data.countOfFiles = ids.length
    data.filesUrl = 'https://google.com'

    const t = await sequelize.transaction()

    if (binding && !_.isEmpty(binding)) {
      binding.userId = userId

      const createBindings = await sequelize.models.bindings.create(binding, {
        transaction: t
      })

      data.bindingId = createBindings?.id
    }
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
    numberOfCopies,
    description,
    binding,
    files
  } = req.body

  const data = {
    color,
    side,
    size,
    countOfPages,
    uploadedPages,
    numberOfCopies,
    description
  }

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

      const filesId = []
      files.forEach((item) => {
        filesId.push(item.id)
      })

      r.setBindings(binding)
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
      console.log(e)
      return httpError(e, res)
    })

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
        // TODO used: false
      },
      attributes: {
        exclude: ['userId', 'bindingId', 'used']
      },
      include: [
        {
          model: sequelize.models.bindings,
          attributes: {
            exclude: ['userId']
          }
        },
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
        id // #TODO USED : FALSE
      },
      attributes: {
        exclude: ['userId', 'bindingId', 'used']
      },
      include: [
        {
          model: sequelize.models.bindings,
          attributes: {
            exclude: ['userId']
          }
        },
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
    .then(() => {
      return res
        .status(messageTypes.SUCCESSFUL_DELETE.statusCode)
        .send(messageTypes.SUCCESSFUL_DELETE)
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

module.exports = { create, findAll, hardDelete, findOne, update }

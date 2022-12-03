const { httpError, messageTypes, errorTypes } = require('../../configs')
const { sequelize } = require('../../models')
const { folders } = require('../../libs')
const _ = require('lodash')

const findOrCreateOrder = async (req, res) => {
  try {
    const userId = req?.user[0]?.id

    const [row, created] = await sequelize.models.orders.findOrCreate({
      where: {
        userId,
        addressId: null
      }
    })

    const folders = await sequelize.models.folders.findAll({
      where: {
        userId,
        used: false
      }
    })

    const folderId = _.isEmpty(folders) ? 1 : folders.length + 1
    const orderId = !_.isEmpty(row) ? row?.id : created?.id

    res.status(200).send({
      statusCode: 200,
      data: {
        folderCode: `${String(orderId)}-${folderId}`,
        phoneNumberToSendFile: String(process.env.PHONENUMBER_TO_SEND_FILE)
      },
      error: null
    })
  } catch (e) {
    return httpError(e, res)
  }
}

const create = async (req, res) => {
  try {
    const {
      color,
      side,
      size,
      countOfPages,
      countOfCopies,
      description,
      binding,
      filesManuallySent,
      files
    } = req.body

    const userId = req?.user[0]?.id

    const extractedBinding = folders.extractBinding(binding)

    const data = {
      color,
      side,
      size,
      countOfPages,
      countOfCopies,
      description,
      binding: extractedBinding,
      filesManuallySent,
      userId
    }

    const ids = []
    const filesInfo = []
    let uploadedPages = 0

    if (!filesManuallySent || filesManuallySent === false) {
      if (files.length === 0) return httpError(errorTypes.MISSING_FILE, res)

      const findedFiles = await sequelize.models.files.findAll({
        where: {
          userId
        }
      })

      for (const entity of files) {
        const findedFile = findedFiles.find((item) => item.id === entity.id)
        if (findedFile) {
          ids.push(entity?.id)
          filesInfo.push({ countOfPages: findedFile?.countOfPages })
          uploadedPages += findedFile?.countOfPages
        }
      }
      if (ids.length === 0) return httpError(errorTypes.MISSING_FILE, res)
    }

    data.countOfFiles = ids.length

    const calculatedPrice = await folders.priceCalculator(
      color,
      side,
      size,
      extractedBinding,
      data.countOfFiles,
      countOfPages,
      countOfCopies,
      filesInfo
    )

    if (calculatedPrice === null)
      return httpError(errorTypes.CONTACT_TO_ADMIN, res)

    data.filesUrl = process.env.FRONT_DOMAIN

    data.amount = calculatedPrice?.amount

    data.shipmentPrice = calculatedPrice?.shipmentPrice

    data.uploadedPages = uploadedPages

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

  const extractedBinding = folders.extractBinding(binding)

  const data = {
    color,
    side,
    size,
    countOfPages,
    binding: extractedBinding,
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
      const filesInfo = []
      let uploadedPages = 0
      if (!filesManuallySent || filesManuallySent === false) {
        for (const entity of files) {
          const findedFile = rFiles.find((item) => item.id === entity.id)
          if (findedFile) {
            filesId.push(entity?.id)
            filesInfo.push({ countOfPages: findedFile?.countOfPages })
            uploadedPages += findedFile?.countOfPages
          }
        }

        if (filesId.length === 0) return httpError(errorTypes.MISSING_FILE, res)
      }
      data.countOfFiles = filesId.length

      return folders
        .priceCalculator(
          color,
          side,
          size,
          extractedBinding,
          data.countOfFiles,
          countOfPages,
          countOfCopies,
          filesInfo
        )
        .then((calculatedPrice) => {
          if (calculatedPrice === null)
            return httpError(errorTypes.CONTACT_TO_ADMIN, res)

          data.amount = calculatedPrice?.amount

          data.uploadedPages = uploadedPages

          data.shipmentPrice = calculatedPrice?.shipmentPrice

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
            item.binding =
              process.env.RUN_ENVIRONMENT === 'local'
                ? JSON.parse(JSON.parse(item?.binding))
                : JSON.parse(item?.binding)

            return item
          }
          return item
        }),
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
      if (r?.binding !== null)
        r.binding =
          process.env.RUN_ENVIRONMENT === 'local'
            ? JSON.parse(JSON.parse(r?.binding))
            : JSON.parse(r?.binding)

      return sequelize.models.orders
        .findOrCreate({
          where: {
            userId,
            addressId: null
          }
        })
        .then(([row, created]) => {
          const orderId = !_.isEmpty(row) ? row?.id : created?.id
          return res.status(200).send({
            statusCode: 200,
            data: {
              ...r.dataValues,
              folderCode: `${String(orderId)}-${id}`,
              phoneNumberToSendFile: String(
                process.env.PHONENUMBER_TO_SEND_FILE
              )
            },
            error: null
          })
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

const priceCalculator = async (req, res) => {
  try {
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

    const extractedBinding = folders.extractBinding(binding)

    console.log(extractedBinding)

    const data = {
      color,
      side,
      size,
      countOfPages,
      countOfCopies,
      description,
      binding: extractedBinding,
      userId
    }

    //TODO Error

    if (files.length === 0) return httpError(errorTypes.MISSING_FILE, res)

    const findedFiles = await sequelize.models.files.findAll({
      where: {
        userId
      }
    })

    const filesInfo = []
    const ids = []
    for (const entity of files) {
      const findedFile = findedFiles.find((item) => item.id === entity.id)
      if (findedFile) {
        ids.push(entity?.id)
        filesInfo.push({ countOfPages: findedFile?.countOfPages })
      }
    }

    if (ids.length === 0) return httpError(errorTypes.MISSING_FILE, res)

    data.countOfFiles = ids.length

    const calculatedPrice = await folders.priceCalculator(
      color,
      side,
      size,
      extractedBinding,
      data.countOfFiles,
      countOfPages,
      countOfCopies,
      filesInfo
    )

    if (calculatedPrice === null)
      return httpError(errorTypes.CONTACT_TO_ADMIN, res)

    res.status(200).send({
      statusCode: 200,
      data: { amount: calculatedPrice?.amount },
      error: null
    })
  } catch (e) {
    console.log(e)
    return httpError(e, res)
  }
}

module.exports = {
  create,
  findAll,
  hardDelete,
  findOne,
  update,
  priceCalculator,
  findOrCreateOrder
}

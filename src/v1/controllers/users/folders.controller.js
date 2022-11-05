const { httpError, messageTypes, errorTypes } = require('../../configs')
const { sequelize } = require('../../models')
const _ = require('lodash')
const zip = require('adm-zip')
const { utils } = require('../../libs')
var zipper = new zip()
zipper.addLocalFile('README.md')
zipper.addLocalFile('.env')
zipper.writeZip('123.zip')

const getPrintTariffs = () => {
  return sequelize.models.print_tariffs
    .findOne({
      where: { id: 1 },
      attributes: ['a3', 'a4', 'a5']
    })
    .then((r) => {
      return {
        a3: JSON.parse(r?.a3),
        a4: JSON.parse(r?.a4),
        a5: JSON.parse(r?.a5)
      }
    })
}
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

    const extractedBinding = extractBinding(binding)

    const data = {
      color,
      side,
      size,
      countOfPages,
      uploadedPages: 5,
      countOfCopies,
      description,
      binding: extractedBinding,
      userId
    }

    const bindingBreakpoint = {
      spring_normal: 300,
      spring_papco: 300,
      stapler: 200
    }
    /*
    color: {
      type: Sequelize.ENUM('black_and_white', 'full_color', 'normal_color'),
      allowNull: false
    },
    side: {
      type: Sequelize.ENUM(
        'single_sided',
        'double_sided',
        'single_sided_glossy',
        'double_sided_glossy'
      ),
      allowNull: false
    },
    size: {
      type: Sequelize.ENUM('a4', 'a5', 'a3'),
      allowNull: false
    },
*/
    const printTariffs = await getPrintTariffs()

    const tariff = printTariffs[size][utils.camelCase(color)]
    let shipmentPrice = tariff[utils.camelCase(side)]

    if (tariff.breakpoints.length > 0) {
      for (let k = 0; k < tariff.breakpoints.length; k++) {
        if (countOfPages >= tariff.breakpoints[k].at) {
          shipmentPrice = tariff.breakpoints[k][utils.camelCase(side)]
        }
      }
    }

    data.shipmentPrice = shipmentPrice

    let amount = shipmentPrice * countOfPages * countOfCopies || 1
    const sideAmount = String(side).includes('single') ? 1 : 2
    data.amount = parseInt(amount * sideAmount)

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

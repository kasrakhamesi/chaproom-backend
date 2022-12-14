const { sequelize } = require('../models')
const fs = require('fs')
const zip = require('adm-zip')
const { utils } = require('.')
require('dotenv').config()

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

const priceCalculator = async (
  color,
  side,
  size,
  extractedBinding,
  countOfUploadedFiles,
  countOfPages,
  countOfCopies,
  filesInfo,
  filesManuallySent
) => {
  try {
    const bindingBreakpoint = {
      springNormal: 300,
      springPapco: 300,
      stapler: 60
    }

    const printTariffs = await getPrintTariffs()

    const otherColor =
      color === 'fullColor'
        ? 'blackAndWhite'
        : color === 'normalColor'
        ? 'fullColor'
        : 'fullColor'

    const tariff = printTariffs[size][utils.camelCase(color)]
    const otherTariff = printTariffs[size][utils.camelCase(otherColor)]
    let shipmentPrice = tariff[utils.camelCase(side)]
    let otherShipmentPrice = otherTariff[utils.camelCase(side)]
    for (let k = 0; k < tariff.breakpoints.length; k++)
      if (countOfPages >= tariff.breakpoints[k].at)
        shipmentPrice = tariff.breakpoints[k][utils.camelCase(side)]

    countOfCopies = countOfCopies === null ? 1 : countOfCopies
    let amount = shipmentPrice * countOfPages
    amount = countOfCopies * amount

    let bindingValue = 0
    let bindingPrice = 0
    if (extractedBinding !== null) {
      const bindingData = JSON.parse(extractedBinding)
      const { method, countOfFiles, type, coverColor } = bindingData

      if (color === 'black_and_white') {
        if (coverColor === 'black_and_white') {
          const newCountOfPages = countOfPages
          amount = shipmentPrice * newCountOfPages
          amount = countOfCopies * amount
        } else {
          const newCountOfPages = parseInt(countOfPages - 1)
          amount = shipmentPrice * newCountOfPages
          amount = countOfCopies * amount
          amount = amount + otherShipmentPrice
        }
      } else if (color === 'normal_color') {
        if (coverColor === 'black_and_white') {
          const newCountOfPages = parseInt(countOfPages - 1)
          amount = shipmentPrice * newCountOfPages
          amount = countOfCopies * amount
          amount = amount + otherShipmentPrice
        } else {
          const newCountOfPages = countOfPages
          amount = shipmentPrice * newCountOfPages
          amount = countOfCopies * amount
        }
      } else if (color === 'full_color') {
        if (coverColor === 'black_and_white') {
          const newCountOfPages = parseInt(countOfPages - 1)
          amount = shipmentPrice * newCountOfPages
          amount = countOfCopies * amount
          amount = amount + otherShipmentPrice
        } else {
          const newCountOfPages = countOfPages
          amount = shipmentPrice * newCountOfPages
          amount = countOfCopies * amount
        }
      }
      console.log(filesManuallySent)
      if (method === 'each_file_separated') {
        if (filesManuallySent) {
          bindingValue += 1
        } else
          for (const entity of filesInfo) {
            console.log(entity)
            bindingValue +=
              parseInt(
                entity.countOfPages / bindingBreakpoint[utils.camelCase(type)]
              ) + 1
          }

        console.log(filesInfo)

        console.log(bindingValue)

        bindingValue = bindingValue * countOfUploadedFiles || 1
      } else if (method === 'all_files_together') {
        if (filesManuallySent) {
          bindingValue += 1
        } else
          bindingValue +=
            parseInt(
              parseInt(countOfPages) / bindingBreakpoint[utils.camelCase(type)]
            ) + 1
      } else if (method === 'count_of_files') {
        bindingValue += parseInt(countOfFiles)
      }

      bindingValue = bindingValue * countOfCopies || 1

      const bindingTariffs = await getBindingPriceses()

      bindingPrice = bindingTariffs[utils.camelCase(type)][size]

      amount = amount + bindingValue * bindingPrice
    }

    return {
      amount,
      shipmentPrice
    }
  } catch (e) {
    return null
  }
}

const archiveFiles = (filesPath, userId, folderId, orderId) => {
  try {
    const newFilesPath = __dirname.replace('libs', 'storages/files')
    const zipper = new zip()
    for (const entity of filesPath) {
      zipper.addLocalFile(`${newFilesPath}/${userId}/${entity}`)
    }
    let filePath = `${newFilesPath}/${userId}/o${orderId}-f${folderId}`
    let returnedPath = `/${userId}/o${orderId}-f${folderId}`
    if (fs.existsSync(filePath)) {
      for (let k = 0; k < Number.MAX_VALUE; k++) {
        filePath = `${newFilesPath}/${userId}/${k}-o${orderId}-f${folderId}`
        returnedPath = `/${userId}/${k}-o${orderId}-f${folderId}`
        if (fs.existsSync(filePath)) continue
        break
      }
    }

    zipper.writeZip(`${filePath}.zip`)
    return `${process.env.BACKEND_DOMAIN}/v1/users/prints${returnedPath}.zip`
  } catch (e) {
    return false
  }
}

const getBindingPriceses = () => {
  return sequelize.models.binding_tariffs
    .findOne({
      where: { id: 1 },
      attributes: {
        exclude: ['id', 'createdAt', 'updatedAt']
      }
    })
    .then((r) => {
      return {
        springNormal: {
          a4: r?.a4_springNormal,
          a3: r?.a3_springNormal,
          a5: r?.a5_springNormal
        },
        springPapco: {
          a4: r?.a4_springPapco,
          a3: r?.a3_springPapco,
          a5: r?.a5_springPapco
        },
        stapler: {
          a4: r?.stapler,
          a3: r?.stapler,
          a5: r?.stapler
        }
      }
    })
}

const getPrintTariffs = () => {
  return sequelize.models.print_tariffs
    .findOne({
      where: { id: 1 },
      attributes: ['a3', 'a4', 'a5']
    })
    .then((r) => {
      const data =
        process.env.RUN_ENVIRONMENT === 'local'
          ? {
              a3: JSON.parse(r.a3),
              a4: JSON.parse(r.a4),
              a5: JSON.parse(r.a5)
            }
          : r

      return data
    })
}

module.exports = { extractBinding, archiveFiles, priceCalculator }

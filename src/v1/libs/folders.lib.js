const { sequelize } = require('../models')
const _ = require('lodash')
const zip = require('adm-zip')
const { utils } = require('.')

const priceCalculator = async (
  color,
  side,
  size,
  extractedBinding,
  countOfUploadedFiles,
  countOfPages,
  countOfCopies,
  filesInfo
) => {
  try {
    const bindingBreakpoint = {
      springNormal: 300,
      springPapco: 300,
      stapler: 200
    }

    const printTariffs = await getPrintTariffs()

    const tariff = printTariffs[size][utils.camelCase(color)]
    let shipmentPrice = tariff[utils.camelCase(side)]

    for (let k = 0; k < tariff.breakpoints.length; k++)
      if (countOfPages >= tariff.breakpoints[k].at)
        shipmentPrice = tariff.breakpoints[k][utils.camelCase(side)]

    let amount = shipmentPrice * countOfPages * countOfCopies || 1

    let bindingValue = 0
    let bindingPrice = 0
    if (extractedBinding !== null) {
      const bindingData = JSON.parse(extractedBinding)
      const { method, countOfFiles, type } = bindingData
      if (method === 'each_file_separated') {
        for (const entity of filesInfo) {
          bindingValue +=
            parseInt(
              entity.countOfPages / bindingBreakpoint[utils.camelCase(type)]
            ) + 1
        }

        bindingValue = bindingValue * countOfUploadedFiles || 1
      } else if (method === 'all_files_together') {
        bindingValue +=
          parseInt(
            parseInt(countOfPages) / bindingBreakpoint[utils.camelCase(type)]
          ) + 1
      } else if (method === 'count_of_files') {
        bindingValue +=
          parseInt(countOfFiles / bindingBreakpoint[utils.camelCase(type)]) + 1
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
    console.log(e)
    return null
  }
}

const archiveFiles = (filesPath, userId, folderId) => {
  var zipper = new zip()
  for (const entity of files) zipper.addLocalFile(entity)
  zipper.writeZip('123.zip')
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

module.exports = { extractBinding, archiveFiles, priceCalculator }

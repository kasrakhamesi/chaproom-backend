const { httpError, messageTypes } = require('../../configs')
const { sequelize } = require('../../models')

const checkValidate = (data) => {
  const { a3, a4, a5 } = req.body

  // const {blackAndWhite,normalColor,fullColor} = req.body
  /*
  const data = JSON.stringify({
    blackAndWhite: {
      singleSided: 480,
      doubleSided: 620,
      singleSidedGlossy: 0,
      doubleSidedGlossy: 0,
      breakpoints: [
        {
          at: 501,
          singleSided: 460,
          doubleSided: 580,
          singleSidedGlossy: 0,
          doubleSidedGlossy: 0
        },
        {
          at: 1001,
          singleSided: 430,
          doubleSided: 560,
          singleSidedGlossy: 0,
          doubleSidedGlossy: 0
        }
      ]
    },
    normalColor: {
      singleSided: 480,
      doubleSided: 620,
      singleSidedGlossy: 0,
      doubleSidedGlossy: 0,
      breakpoints: [
        {
          at: 501,
          singleSided: 460,
          doubleSided: 580,
          singleSidedGlossy: 0,
          doubleSidedGlossy: 0
        },
        {
          at: 1001,
          singleSided: 430,
          doubleSided: 560,
          singleSidedGlossy: 0,
          doubleSidedGlossy: 0
        }
      ]
    },
    fullColor: {
      singleSided: 480,
      doubleSided: 620,
      singleSidedGlossy: 0,
      doubleSidedGlossy: 0,
      breakpoints: [
        {
          at: 501,
          singleSided: 460,
          doubleSided: 580,
          singleSidedGlossy: 0,
          doubleSidedGlossy: 0
        },
        {
          at: 1001,
          singleSided: 430,
          doubleSided: 560,
          singleSidedGlossy: 0,
          doubleSidedGlossy: 0
        }
      ]
    }
  })
  */
}

const update = (req, res) => {
  /*
  const { springNormal, springPapco, stapler } = req.body

  const data = {
    a4_springNormal: springNormal.a4,
    a5_springNormal: springNormal.a5,
    a3_springNormal: springNormal.a3,
    a5_springPapco: springPapco.a5,
    a4_springPapco: springPapco.a4,
    a3_springPapco: springPapco.a3,
    stapler
  }

  const validatedData = checkValidate(data)

  if (!validatedData.isSuccess)
    return res.status(400).send({
      statusCode: 400,
      data: null,
      error: {
        message: validatedData.message,
        details: []
      }
    })
*/
  return sequelize.models.print_tariffs
    .update(req.body, {
      where: { id: 1 }
    })
    .then(() => {
      return res
        .status(messageTypes.SUCCESSFUL_UPDATE.statusCode)
        .send(messageTypes.SUCCESSFUL_UPDATE)
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const findAll = (req, res) => {
  return sequelize.models.binding_tariffs
    .findOne({
      where: { id: 1 },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'id']
      }
    })
    .then((r) => {
      return res.status(200).send({
        statusCode: 200,
        data: {
          springNormal: {
            a4: r.a4_springNormal,
            a3: r.a3_springNormal,
            a5: r.a5_springNormal
          },
          springPapco: {
            a4: r.a4_springPapco,
            a3: r.a3_springPapco,
            a5: r.a5_springPapco
          },
          stapler: r.stapler
        },
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

module.exports = { findAll, update }

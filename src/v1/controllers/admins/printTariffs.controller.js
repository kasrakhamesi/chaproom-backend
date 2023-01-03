const { httpError, messageTypes } = require('../../configs')
const { sequelize } = require('../../models')
const _ = require('lodash')

const checkChildObject = (object) => {
  const {
    singleSided,
    doubleSided,
    singleSidedGlossy,
    doubleSidedGlossy,
    breakpoints
  } = object

  let error = false

  if (
    !_.isInteger(singleSided) ||
    !_.isInteger(doubleSided) ||
    !_.isInteger(singleSidedGlossy) ||
    !_.isInteger(doubleSidedGlossy)
  ) {
    error = true
  }

  if (breakpoints?.length > 0) {
    for (const entity of breakpoints) {
      if (
        !_.isInteger(entity?.at) ||
        !_.isInteger(entity?.singleSided) ||
        !_.isInteger(entity?.doubleSided) ||
        !_.isInteger(entity?.singleSidedGlossy) ||
        !_.isInteger(entity?.doubleSidedGlossy)
      )
        error = true
    }
  }

  return error
}

const checkValidate = (data) => {
  const { a3, a4, a5 } = data
  let error = false

  if (!a3 && !a4 && !a5) {
    error = true
    return error
  }
  if (a3) {
    if (a3?.blackAndWhite) {
      error = checkChildObject(a3?.blackAndWhite)
    }
    if (a3?.normalColor) {
      error = checkChildObject(a3?.normalColor)
    }
    if (a3?.fullColor) {
      error = checkChildObject(a3?.fullColor)
    }
  }

  if (a4) {
    if (a4?.blackAndWhite) {
      error = checkChildObject(a4?.blackAndWhite)
    }
    if (a4?.normalColor) {
      error = checkChildObject(a4?.normalColor)
    }
    if (a4?.fullColor) {
      error = checkChildObject(a4?.fullColor)
    }
  }

  if (a5) {
    if (a5?.blackAndWhite) {
      error = checkChildObject(a5?.blackAndWhite)
    }
    if (a5?.normalColor) {
      error = checkChildObject(a5?.normalColor)
    }
    if (a5?.fullColor) {
      error = checkChildObject(a5?.fullColor)
    }
  }

  return error
}

const update = (req, res) => {
  const { a3, a4, a5 } = req.body

  const data = {
    a3,
    a4,
    a5
  }

  const rValidate = checkValidate(req.body)

  if (rValidate)
    return res.status(400).send({
      statusCode: 400,
      data: null,
      error: {
        message: 'لطفا تمام ورودی ها را بصورت معتبر وارد کنید',
        details: []
      }
    })

  return sequelize.models.print_tariffs
    .update(data, {
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
  return sequelize.models.print_tariffs
    .findOne({
      where: { id: 1 },
      attributes: ['a3', 'a4', 'a5']
    })
    .then((r) => {
      return res.status(200).send({
        statusCode: 200,
        data:
          process.env.RUN_ENVIRONMENT === 'local'
            ? {
                a3: JSON.parse(r.a3),
                a4: JSON.parse(r.a4),
                a5: JSON.parse(r.a5)
              }
            : r,
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

module.exports = { findAll, update }

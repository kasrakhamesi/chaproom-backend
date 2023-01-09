const { httpError, messageTypes } = require('../../configs')
const { sequelize } = require('../../models')
const _ = require('lodash')

const checkValidate = async (data) => {
  try {
    const r = await sequelize.models.book_tariffs.findOne({
      where: { id: 1 },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'id']
      }
    })

    const oldTariffs =
      process.env.RUN_ENVIRONMENT === 'local' ? JSON.parse(r?.tariffs) : r

    const { rahli, raqai, vaziri } = data

    if (!rahli && !raqai && !vaziri)
      return {
        isSuccess: false,
        message: 'لطفا تمام ورودی ها را بصورت معتبر وارد کنید'
      }

    let newTariffs = oldTariffs
    if (rahli) newTariffs.rahli = rahli
    if (raqai) newTariffs.raqai = raqai
    if (vaziri) newTariffs.vaziri = vaziri

    return {
      isSuccess: true,
      data: newTariffs
    }
  } catch {
    return {
      isSuccess: false,
      message: 'لطفا تمام ورودی ها را بصورت معتبر وارد کنید'
    }
  }
}

const update = async (req, res) => {
  try {
    const validatedData = await checkValidate(req.body)

    if (!validatedData.isSuccess)
      return res.status(400).send({
        statusCode: 400,
        data: null,
        error: {
          message: validatedData.message,
          details: []
        }
      })

    await sequelize.models.book_tariffs.update(
      { tariffs: validatedData?.data },
      {
        where: { id: 1 }
      }
    )
    return res
      .status(messageTypes.SUCCESSFUL_UPDATE.statusCode)
      .send(messageTypes.SUCCESSFUL_UPDATE)
  } catch {
    return httpError(e, res)
  }
}

const findAll = (req, res) => {
  return sequelize.models.book_tariffs
    .findOne({
      where: { id: 1 },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'id']
      }
    })
    .then((r) => {
      return res.status(200).send({
        statusCode: 200,
        data:
          process.env.RUN_ENVIRONMENT === 'local' ? JSON.parse(r?.tariffs) : r,
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

module.exports = { findAll, update }

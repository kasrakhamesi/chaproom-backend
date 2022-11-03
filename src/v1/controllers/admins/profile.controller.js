const { httpError, messageTypes } = require('../../configs')
const { utils } = require('../../libs')
const { authorize } = require('../../middlewares')
const { sequelize } = require('../../models')

const update = (req, res) => {
  const { name, password } = req.body
  const adminId = req?.user[0]?.id
  const data =
    password === '' || password === null
      ? {
          name,
          phoneNumber
        }
      : {
          password,
          phoneNumber,
          name
        }
  return sequelize.models.admins
    .findOne({
      where: {
        id: adminId
      }
    })
    .then((r) => {
      return r.update(data).then(() => {
        const accessToken = authorize.generateAdminJwt(r?.id, r?.phoneNumber)
        return res.status(messageTypes.SUCCESSFUL_UPDATE.statusCode).send({
          statusCode: messageTypes.SUCCESSFUL_UPDATE.statusCode,
          data: {
            message: messageTypes.SUCCESSFUL_UPDATE.data.message,
            token: {
              access: accessToken,
              expire: utils.timestampToIso(authorize.decodeJwt(accessToken).exp)
            }
          },
          error: null
        })
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

const findOne = (req, res) => {
  const adminId = req?.user[0]?.id
  return sequelize.models.admins
    .findOne({
      include: {
        model: sequelize.models.admins_roles,
        as: 'role',
        attributes: ['id', 'name']
      },
      where: {
        id: adminId
      },
      attributes: {
        exclude: ['password', 'roleId']
      }
    })
    .then((r) => {
      return res.status(200).send({
        statusCode: 200,
        data: {
          ...r.dataValues,
          avatar: null
        },
        error: null
      })
    })
    .catch((e) => {
      return httpError(e, res)
    })
}

module.exports = { findOne, update }

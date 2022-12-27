const { sequelize } = require('../../models')
const { restful, filters } = require('../../libs')
const { httpError, errorTypes, messageTypes } = require('../../configs')
const admins = new restful(sequelize.models.admins)
const bcrypt = require('bcrypt')

const createAdminFromUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await sequelize.models.users.findOne({
      where: {
        id
      }
    })

    if (!user) return httpError(errorTypes.USER_NOT_FOUND, res)

    const admin = await sequelize.models.admins.findOne({
      where: {
        phoneNumber: user?.phoneNumber
      }
    })

    if (admin) return httpError(errorTypes.ADMIN_EXIST_ERROR, res)

    const data = {
      phoneNumber: user?.phoneNumber,
      roleId: 2,
      name: user?.name,
      password: user?.password
    }

    await sequelize.models.admins.create(data)

    res
      .status(messageTypes.SUCCESSFUL_CREATED.statusCode)
      .send(messageTypes.SUCCESSFUL_CREATED)
  } catch (e) {
    return httpError(e, res)
  }
}

const create = async (req, res) => {
  try {
    const { phoneNumber, name, password } = req.body
    const data = {
      phoneNumber,
      roleId: 2,
      name,
      password: bcrypt.hashSync(password, 12)
    }

    const admin = await sequelize.models.admins.findOne({
      where: {
        phoneNumber
      }
    })

    if (admin) return httpError(errorTypes.ADMIN_EXIST_ERROR, res)

    await sequelize.models.admins.create(data)

    res
      .status(messageTypes.SUCCESSFUL_CREATED.statusCode)
      .send(messageTypes.SUCCESSFUL_CREATED)
  } catch (e) {
    return httpError(e, res)
  }
}

const update = async (req, res) => {
  const { id } = req.params
  const { phoneNumber, name, password } = req.body

  const data =
    password === '' ||
    password === null ||
    password === undefined ||
    password == null ||
    String(password).length < 8
      ? {
          phoneNumber,
          roleId: 2,
          name
        }
      : {
          phoneNumber,
          roleId: 2,
          name,
          password: bcrypt.hashSync(password, 12)
        }

  return sequelize.models.admins
    .update(data, {
      where: {
        id
      }
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

const findAll = async (req, res) => {
  try {
    const { page, pageSize } = req.query
    const [order, where] = await filters.filter(
      req.query,
      sequelize.models.admins
    )

    const r = await admins.Get({
      include: {
        model: sequelize.models.admins_roles,
        as: 'role',
        attributes: ['id', 'name']
      },
      attributes: [
        'id',
        'name',
        'phoneNumber',
        'active',
        'createdAt',
        'updatedAt'
      ],
      where,
      order: [['id', 'desc']],
      pagination: {
        active: true,
        page,
        pageSize
      }
    })

    return res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
  }
}

const findOne = async (req, res) => {
  const { id } = req.params
  return sequelize.models.admins
    .findOne({
      include: {
        model: sequelize.models.admins_roles,
        as: 'role',
        attributes: ['id', 'name']
      },
      where: { id },
      attributes: {
        exclude: ['roleId', 'password']
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

const softDelete = async (req, res) => {
  try {
    const { id } = req.params

    if (id === 1) return httpError(errorTypes.CANT_DELETE_FOUNDER, res)

    const admin = await sequelize.models.admins.findOne({
      where: { id }
    })

    if (!admin) return httpError(errorTypes.ADMIN_NOT_FOUND, res)

    const r = await admins.Delete({ req, where: { id } })

    return res.status(r?.statusCode).send(r)
  } catch (e) {
    return httpError(e, res)
  }
}

module.exports = {
  create,
  update,
  findAll,
  findOne,
  softDelete,
  createAdminFromUser
}

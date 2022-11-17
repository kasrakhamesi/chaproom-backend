const { sequelize } = require('../models')
const _ = require('lodash')
const { httpError } = require('../configs')

const check = (...permissions) => {
  return async (req, res, next) => {
    try {
      const roleId = req?.user[0]?.role?.id
      const getPermissionsFromRoleId =
        await sequelize.models.admins_role_perm.findAll({
          where: {
            roleId: roleId
          }
        })

      if (_.isEmpty(getPermissionsFromRoleId)) throw new Error('Forbidden')

      const getPermissions = await sequelize.models.admins_permissions.findAll()

      let targetPermissions = []

      for (const data of getPermissionsFromRoleId) {
        getPermissions
          .filter((item) => item.id === data.permId)
          .map((item) => {
            targetPermissions.push({
              id: item.id,
              role: item.role,
              perm_description: item.perm_description
            })
          })
      }

      targetPermissions = await Promise.all(targetPermissions)

      for (const permissionsData of targetPermissions) {
        for (const adminPermissions of permissions) {
          if (
            adminPermissions === permissionsData.role ||
            permissionsData.role === 'GOD'
          )
            return next()
        }
      }
      throw new Error('Forbidden')
    } catch (e) {
      return httpError(e, res)
    }
  }
}

module.exports = { check }

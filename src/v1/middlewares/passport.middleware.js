const Passport = require('passport').Passport
const passportJwt = require('passport-jwt')
const { sequelize } = require('../models')
const adminsPassport = new Passport()
const usersPassport = new Passport()
const ExtractJwt = passportJwt.ExtractJwt
const StrategyJwt = passportJwt.Strategy

const adminAccess = 'qqqqq'
const userAccess = 'rrrr'

adminsPassport.use(
  new StrategyJwt(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: adminAccess
    },
    (jwtPayLoad, done) => {
      return sequelize.models.admins
        .findAll({
          where: {
            id: jwtPayLoad.id,
            roleId: jwtPayLoad.roleId,
            username: jwtPayLoad.username,
            email: jwtPayLoad.email,
            phone: jwtPayLoad.phone
          },
          include: {
            model: sequelize.models.admins_roles,
            as: 'role',
            include: {
              model: sequelize.models.admins_permissions,
              as: 'permissions',
              through: {
                attributes: {
                  exclude: ['createdAt', 'updatedAt', 'permId', 'roleId']
                }
              }
            }
          }
        })
        .then((result) => {
          const adminsInfo = result.map((item) => {
            return {
              id: item.id,
              role: item.role,
              name: item.name,
              username: item.username,
              password: item.password,
              last_login: item.last_login,
              email: item.email,
              phone: item.phone,
              activated: item.activated,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt
            }
          })
          return done(null, adminsInfo)
        })
        .catch((err) => {
          return done(err)
        })
    }
  )
)

usersPassport.use(
  new StrategyJwt(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: userAccess
    },
    (jwtPayLoad, done) => {
      return sequelize.models.users
        .findAll({
          where: {
            id: jwtPayLoad.id,
            phone: jwtPayLoad.phone,
            national_code: jwtPayLoad.national_code
          },
          include: [
            {
              model: sequelize.models.users_groups,
              as: 'user_group'
            },
            {
              model: sequelize.models.users,
              as: 'referral',
              attributes: {
                include: ['national_code']
              }
            }
          ],
          attributes: {
            exclude: ['userGroupId', 'referralUserId']
          }
        })
        .then((result) => {
          return done(null, result)
        })
        .catch((err) => {
          return done(err)
        })
    }
  )
)

module.exports = { adminsPassport, usersPassport }

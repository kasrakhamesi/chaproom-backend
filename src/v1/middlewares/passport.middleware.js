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
            id: jwtPayLoad.id
          },
          attributes: {
            exclude: ['password']
          }
        })
        .then((r) => {
          return done(null, r)
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
            id: jwtPayLoad.id
          },
          attributes: {
            exclude: ['password']
          }
        })
        .then((r) => {
          return done(null, r)
        })
        .catch((e) => {
          return done(e)
        })
    }
  )
)

module.exports = { adminsPassport, usersPassport }

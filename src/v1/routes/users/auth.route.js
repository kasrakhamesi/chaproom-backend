const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { passport } = require('../../middlewares')

const usersPassport = passport.usersPassport.authenticate('jwt', {
  session: false,
  failureRedirect: '/v1/failures/unauthorized'
})

const { users } = require('../../controllers')
router.post('/login', users.auth.login)
router.post('/register', users.auth.register)
router.post('/register/confirm', users.auth.registerConfirm)
//router.post('/change-password', usersPassport, users.auth.changePassword)

module.exports = router

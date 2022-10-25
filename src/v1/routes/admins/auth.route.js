const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { admins } = require('../../controllers')
router.post('/login', admins.auth.login)
//router.post('/register', users.auth.register)
//router.post('/register/confirm', users.auth.registerConfirm)
//router.post('/change-password', usersPassport, users.auth.changePassword)

module.exports = router

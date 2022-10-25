const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { users } = require('../../controllers')
router.post('/login', users.auth.login)
router.post('/register', users.auth.register)
router.post('/register/confirm', users.auth.registerConfirm)

module.exports = router

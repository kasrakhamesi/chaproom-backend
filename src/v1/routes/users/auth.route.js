const { Router } = require('express')
const bodyParser = require('body-parser')
const router = Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const { users } = require('../../controllers')
router.post('/login', users.auth.login)
router.post('/register', users.auth.register)
router.post('/resend-code', users.auth.resendCode)
router.post('/register/confirm', users.auth.registerConfirm)

router.post('/password-reset', users.auth.passwordReset)
router.post('/password-reset/confirm-code', users.auth.passwordResetConfirmCode)
router.put('/password-reset/confirm-code', users.auth.passwordResetSubmit)

module.exports = router
